import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAvailableSlots } from "@/lib/availability";
import { addDays } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("lawyer");
  const service = (url.searchParams.get("service") ?? "CONSULTATION").toUpperCase();
  const daysParam = Number(url.searchParams.get("days") ?? "21");
  const days = Math.min(Math.max(daysParam, 1), 60);

  if (!slug) {
    return NextResponse.json({ error: "Missing ?lawyer=<slug>" }, { status: 400 });
  }

  const lawyer = await prisma.lawyer.findUnique({ where: { slug } });
  if (!lawyer || !lawyer.active) {
    return NextResponse.json({ error: "Lawyer not found" }, { status: 404 });
  }

  const slotMinutes =
    service === "MEDIATION"
      ? lawyer.mediationMinutes ?? 90
      : lawyer.consultationMinutes;

  const from = new Date();
  const to = addDays(from, days);

  const slots = await getAvailableSlots({
    lawyerId: lawyer.id,
    from,
    to,
    slotMinutes,
    bufferMinutes: lawyer.bufferMinutes,
    minNoticeHours: lawyer.minNoticeHours,
  });

  return NextResponse.json({
    lawyer: {
      slug: lawyer.slug,
      name: lawyer.name,
      timezone: lawyer.timezone,
      consultationMinutes: lawyer.consultationMinutes,
      mediationMinutes: lawyer.mediationMinutes,
      consultationRateCents: lawyer.consultationRateCents,
      mediationRateCents: lawyer.mediationRateCents,
      isMediator: lawyer.isMediator,
    },
    service,
    slotMinutes,
    slots: slots.map((s) => ({
      start: s.start.toISOString(),
      end: s.end.toISOString(),
    })),
  });
}
