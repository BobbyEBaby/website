/**
 * Seed the database with the 10 lawyers from src/data/lawyers.ts and a
 * sensible default weekly availability (Mon–Fri 9:00–12:00, 13:00–17:00).
 *
 * Run with: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import { lawyers } from "../src/data/lawyers";

const prisma = new PrismaClient();

async function main() {
  for (const l of lawyers) {
    const email =
      l.email ?? `${l.slug}@rwelaw.ca`.replace(/[^a-z0-9@.-]/gi, "");

    const lawyer = await prisma.lawyer.upsert({
      where: { slug: l.slug },
      update: {
        name: l.name,
        title: l.title,
        email,
        consultationRateCents: l.consultationRateCad * 100,
        consultationMinutes: l.consultationMinutes,
        isMediator: Boolean(l.isMediator),
      },
      create: {
        slug: l.slug,
        name: l.name,
        title: l.title,
        email,
        consultationRateCents: l.consultationRateCad * 100,
        consultationMinutes: l.consultationMinutes,
        isMediator: Boolean(l.isMediator),
      },
    });

    // Default rules: Mon–Fri 09:00–12:00 and 13:00–17:00.
    const existingRules = await prisma.availabilityRule.count({
      where: { lawyerId: lawyer.id },
    });
    if (existingRules === 0) {
      const windows = [
        { startMin: 9 * 60, endMin: 12 * 60 },
        { startMin: 13 * 60, endMin: 17 * 60 },
      ];
      for (let dow = 1; dow <= 5; dow++) {
        for (const w of windows) {
          await prisma.availabilityRule.create({
            data: {
              lawyerId: lawyer.id,
              dayOfWeek: dow,
              startMin: w.startMin,
              endMin: w.endMin,
            },
          });
        }
      }
      console.log(`Seeded availability for ${lawyer.name}`);
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
