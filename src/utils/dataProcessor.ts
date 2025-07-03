// src/utils/dataProcessor.ts

import type {
  RawStudentData,
  ProcessedStudent,
  Personality,
  Aptitude,
} from "../types";

const findTopItem = (scores: { [key: string]: number }): string => {
  if (!scores || Object.keys(scores).length === 0) return "N/A";
  return Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
};

export const processStudentData = (
  student: RawStudentData,
  personalities: Personality[],
  aptitudes: Aptitude[]
): ProcessedStudent => {
  const topPersonalityKey = findTopItem(student.personality);
  const topAptitudeKey = findTopItem(student.aptitude);

  const personalityInfo = personalities.find(
    (p) => p.personality.toLowerCase() === topPersonalityKey.toLowerCase()
  );

  const aptitudeInfo = aptitudes.find((a) =>
    a.aptitude.toLowerCase().includes(topAptitudeKey.toLowerCase())
  );

  return {
    id: student.id,
    nama: student.nama || "Tidak ada nama",
    gender: student.gender || "Tidak diketahui",
    character: personalityInfo ? personalityInfo.name : "Belum dianalisis",
    // --- PERUBAHAN DI SINI ---
    // Kolom 'persona' sekarang diisi dengan 'minidescription'
    persona: personalityInfo
      ? personalityInfo.minidescription
      : "Belum dianalisis",
    talent: aptitudeInfo ? aptitudeInfo.talents.map((t) => t.talentName) : [],
    major: aptitudeInfo ? aptitudeInfo.suitableMajors : [],
  };
};
