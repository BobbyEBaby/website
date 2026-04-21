/**
 * Availability resolution: given a lawyer's rules, exceptions, existing
 * bookings, and a date range — return the list of bookable slot start times.
 *
 * All time math is done in the lawyer's local timezone using Intl APIs.
 */

import { prisma } from "./db";
import {
  addDays,
  addMinutes,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
} from "date-fns";

type SlotParams = {
  lawyerId: string;
  /** Inclusive start date (UTC instant, will be converted to lawyer tz). */
  from: Date;
  /** Exclusive end date. */
  to: Date;
  /** Duration of the slot in minutes. */
  slotMinutes: number;
  /** Buffer between appointments in minutes. */
  bufferMinutes: number;
  /** Minimum hours of notice before an appointment can be booked. */
  minNoticeHours: number;
};

export type Slot = {
  start: Date;
  end: Date;
};

/**
 * Zoned date helpers. We treat the lawyer's timezone as canonical and use
 * Intl.DateTimeFormat to pull wall-clock fields for a given UTC instant.
 */
function zonedParts(instant: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(instant);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    dayOfWeek: dayMap[weekday] ?? 1,
  };
}

/**
 * Build a UTC Date that represents a given wall-clock time in the specified
 * timezone. Uses the offset round-trip technique.
 */
function zonedWallToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  const utcDate = new Date(asUtc);
  const parts = zonedParts(utcDate, timeZone);
  const tzAsUtc = Date.UTC(
    parts.year, parts.month - 1, parts.day, parts.hour, parts.minute
  );
  const offsetMs = asUtc - tzAsUtc;
  return new Date(asUtc + offsetMs);
}

export async function getAvailableSlots(params: SlotParams): Promise<Slot[]> {
  const { lawyerId, from, to, slotMinutes, bufferMinutes, minNoticeHours } =
    params;

  const lawyer = await prisma.lawyer.findUnique({ where: { id: lawyerId } });
  if (!lawyer) return [];
  const tz = lawyer.timezone;

  const [rules, exceptions, bookings] = await Promise.all([
    prisma.availabilityRule.findMany({ where: { lawyerId } }),
    prisma.availabilityException.findMany({
      where: {
        lawyerId,
        start: { lt: to },
        end: { gt: from },
      },
    }),
    prisma.booking.findMany({
      where: {
        lawyerId,
        start: { lt: to },
        end: { gt: from },
        status: { in: ["PENDING_PAYMENT", "CONFIRMED"] },
      },
      select: { start: true, end: true },
    }),
  ]);

  const earliestBookable = addMinutes(new Date(), minNoticeHours * 60);
  const slots: Slot[] = [];

  // Walk day by day in lawyer timezone.
  let cursor = startOfDay(from);
  const terminal = endOfDay(to);
  while (isBefore(cursor, terminal)) {
    const parts = zonedParts(cursor, tz);
    const dayRules = rules.filter((r) => r.dayOfWeek === parts.dayOfWeek);

    for (const rule of dayRules) {
      const ruleStart = zonedWallToUtc(
        parts.year,
        parts.month,
        parts.day,
        Math.floor(rule.startMin / 60),
        rule.startMin % 60,
        tz
      );
      const ruleEnd = zonedWallToUtc(
        parts.year,
        parts.month,
        parts.day,
        Math.floor(rule.endMin / 60),
        rule.endMin % 60,
        tz
      );

      let slotStart = ruleStart;
      while (
        !isAfter(addMinutes(slotStart, slotMinutes), ruleEnd)
      ) {
        const slotEnd = addMinutes(slotStart, slotMinutes);

        const beforeRange = isBefore(slotEnd, from) || isBefore(slotStart, earliestBookable);
        const afterRange = !isBefore(slotStart, to);

        if (!beforeRange && !afterRange) {
          const blocked = exceptions.some(
            (ex) =>
              ex.kind === "BLOCK" &&
              isBefore(ex.start, slotEnd) &&
              isAfter(ex.end, slotStart)
          );
          const taken = bookings.some(
            (b) =>
              isBefore(b.start, addMinutes(slotEnd, bufferMinutes)) &&
              isAfter(b.end, addMinutes(slotStart, -bufferMinutes))
          );
          if (!blocked && !taken) {
            slots.push({ start: slotStart, end: slotEnd });
          }
        }

        slotStart = addMinutes(slotStart, slotMinutes);
      }
    }

    // EXTRA exceptions on this day — add them too.
    const extras = exceptions.filter((ex) => ex.kind === "EXTRA");
    for (const extra of extras) {
      if (!isBefore(extra.start, terminal) && !isAfter(extra.end, cursor))
        continue;
      let slotStart = new Date(Math.max(extra.start.getTime(), cursor.getTime()));
      const windowEnd = new Date(
        Math.min(extra.end.getTime(), terminal.getTime())
      );
      while (!isAfter(addMinutes(slotStart, slotMinutes), windowEnd)) {
        const slotEnd = addMinutes(slotStart, slotMinutes);
        if (!isBefore(slotStart, earliestBookable)) {
          const taken = bookings.some(
            (b) =>
              isBefore(b.start, addMinutes(slotEnd, bufferMinutes)) &&
              isAfter(b.end, addMinutes(slotStart, -bufferMinutes))
          );
          if (!taken) slots.push({ start: slotStart, end: slotEnd });
        }
        slotStart = addMinutes(slotStart, slotMinutes);
      }
    }

    cursor = addDays(cursor, 1);
  }

  // De-duplicate by start time and sort.
  const seen = new Set<number>();
  return slots
    .filter((s) => {
      const k = s.start.getTime();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}
