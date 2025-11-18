import { redirect } from "next/navigation";
import { UNITS_DATA } from "@/lib/data/units";
import RoleplayClient from "./RoleplayClient";

interface Props {
  params: Promise<{
    unitId: string;
    lessonId: string;
  }>;
}

export default async function RoleplayPage({ params }: Props) {
  const { unitId, lessonId } = await params;

  // Find the unit
  const unit = UNITS_DATA.find((u) => u.unitId === unitId);
  if (!unit) {
    redirect("/");
  }

  // Check if it's final roleplay or individual lesson roleplay
  const isFinalRoleplay = lessonId === "final";

  if (isFinalRoleplay) {
    // Return final roleplay component
    return <RoleplayClient type="final" unitId={unitId} unit={unit} />;
  }

  // Individual lesson roleplay
  const lesson = unit.lessons.find((l) => l.id === lessonId);
  if (!lesson) {
    redirect("/");
  }

  return <RoleplayClient type="individual" unitId={unitId} lesson={lesson} />;
}
