import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const Schema = z.object({
  rules: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      startMin: z.number().int().min(0).max(24 * 60 - 1),
      endMin: z.number().int().min(1).max(24 * 60),
    }).refine((r) => r.endMin > r.startMin, {
      message: "End must be after start",
    })
  ),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid rules", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const lawyer = await prisma.lawyer.findUnique({ where: { slug } });
  if (!lawyer) {
    return NextResponse.json({ error: "Lawyer not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.availabilityRule.deleteMany({ where: { lawyerId: lawyer.id } }),
    prisma.availabilityRule.createMany({
      data: parsed.data.rules.map((r) => ({
        lawyerId: lawyer.id,
        dayOfWeek: r.dayOfWeek,
        startMin: r.startMin,
        endMin: r.endMin,
      })),
    }),
  ]);

  return NextResponse.json({ ok: true, count: parsed.data.rules.length });
}
