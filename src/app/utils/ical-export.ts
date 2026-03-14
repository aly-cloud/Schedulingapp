import { ScheduleBlock } from "../types/task";

export function generateICalFile(schedule: ScheduleBlock[], filename: string = "schedule.ics"): void {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  let ical = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Schedule AI//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  schedule.forEach((block) => {
    ical.push(
      "BEGIN:VEVENT",
      `UID:${block.id}@schedule-ai`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(block.startTime)}`,
      `DTEND:${formatDate(block.endTime)}`,
      `SUMMARY:${block.title}`,
      `DESCRIPTION:${block.description || ""}`,
      `CATEGORIES:${block.category}`,
      "END:VEVENT"
    );
  });

  ical.push("END:VCALENDAR");

  const icalContent = ical.join("\r\n");
  const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
