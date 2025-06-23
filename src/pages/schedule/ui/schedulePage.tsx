import { SchedulePageContent } from "./schedulePageContent";

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return id !== undefined && <SchedulePageContent scheduleId={id} />;
}
