import {
  Award,
  BookOpen,
  Calculator,
  Code2,
  FlaskConical,
  Globe2,
  GraduationCap,
  Landmark,
  Languages,
  type LucideIcon,
  Monitor,
  Music,
  Palette,
} from "lucide-react";

export const ICON_OPTIONS: { value: string; icon: LucideIcon }[] = [
  { value: "BookOpen", icon: BookOpen },
  { value: "GraduationCap", icon: GraduationCap },
  { value: "Landmark", icon: Landmark },
  { value: "Monitor", icon: Monitor },
  { value: "Code2", icon: Code2 },
  { value: "Palette", icon: Palette },
  { value: "Globe2", icon: Globe2 },
  { value: "Calculator", icon: Calculator },
  { value: "FlaskConical", icon: FlaskConical },
  { value: "Award", icon: Award },
  { value: "Languages", icon: Languages },
  { value: "Music", icon: Music },
];

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  ICON_OPTIONS.map(({ value, icon }) => [value, icon])
);

export function getIconComponent(name: string): LucideIcon {
  return ICON_MAP[name] ?? BookOpen;
}

export const COLOR_OPTIONS: { value: string; label: string; swatch: string }[] = [
  { value: "text-teal-600 bg-teal-100", label: "Teal", swatch: "bg-teal-500" },
  { value: "text-indigo-600 bg-indigo-100", label: "Indigo", swatch: "bg-indigo-500" },
  { value: "text-amber-600 bg-amber-100", label: "Amber", swatch: "bg-amber-500" },
  { value: "text-emerald-600 bg-emerald-100", label: "Emerald", swatch: "bg-emerald-500" },
  { value: "text-rose-600 bg-rose-100", label: "Rose", swatch: "bg-rose-500" },
  { value: "text-violet-600 bg-violet-100", label: "Violet", swatch: "bg-violet-500" },
  { value: "text-blue-600 bg-blue-100", label: "Blue", swatch: "bg-blue-500" },
  { value: "text-orange-600 bg-orange-100", label: "Orange", swatch: "bg-orange-500" },
];
