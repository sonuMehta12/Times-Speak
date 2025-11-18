import { redirect } from "next/navigation";
import { UNITS_DATA } from "@/lib/data/units";
import QuizClient from "./QuizClient";

interface Props {
  params: Promise<{
    unitId: string;
    lessonId: string;
  }>;
}

export default async function QuizPage({ params }: Props) {
  const { unitId, lessonId } = await params;

  // Find the unit
  const unit = UNITS_DATA.find((u) => u.unitId === unitId);
  if (!unit) {
    redirect("/");
  }

  // Check if it's final quiz or individual lesson quiz
  const isFinalQuiz = lessonId === "final";

  if (isFinalQuiz) {
    // Return final quiz component
    return <QuizClient type="final" unitId={unitId} unit={unit} />;
  }

  // Individual lesson quiz
  const lessonIndex = unit.lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex === -1) {
    redirect("/");
  }

  const lesson = unit.lessons[lessonIndex];

  return (
    <QuizClient
      type="individual"
      unitId={unitId}
      lesson={lesson}
      lessonNumber={lessonIndex + 1}
      totalLessons={unit.lessons.length}
    />
  );
}
