import { redirect } from "next/navigation";
import { UNITS_DATA } from "@/lib/data/units";
import LessonClient from "./LessonClient";

interface Props {
  params: Promise<{
    unitId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: Props) {
  const { unitId, lessonId } = await params;

  // Redirect if trying to access "final" lesson
  // (there is no final lesson, only final quiz/roleplay)
  if (lessonId === "final") {
    redirect(`/${unitId}/l1/lesson`);
  }

  // Find the unit and lesson
  const unit = UNITS_DATA.find((u) => u.unitId === unitId);
  if (!unit) {
    redirect("/");
  }

  const lessonIndex = unit.lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex === -1) {
    redirect("/");
  }

  const lesson = unit.lessons[lessonIndex];

  return (
    <LessonClient
      lesson={lesson}
      unitId={unitId}
      lessonNumber={lessonIndex + 1}
      totalLessons={unit.lessons.length}
    />
  );
}
