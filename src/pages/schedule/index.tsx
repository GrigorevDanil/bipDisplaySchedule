import { SchedulePageContent } from "./schedulePageContent";

type Props = {
  params: Promise<{ corpusId: string; collectionId: string }>;
};

export const SchedulePage = async ({ params }: Props) => {
  const { corpusId, collectionId } = await params;

  return (
    <SchedulePageContent collectionId={collectionId} corpusId={corpusId} />
  );
};
