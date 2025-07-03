// src/types/index.ts

export interface School {
  id: number;
  school_name: string;
  city: string;
  region: string;
  village: string;
}

export interface Personality {
  id: number;
  personality: string;
  name: string;
  tagline: string;
  hashtags: string[];
  minidescription: string;
}

export interface Aptitude {
  id: number;
  aptitude: string;
  description: string;
  talents: { talentName: string; proficiency: number }[];
  suitableMajors: string[];
  suitableCareers: string[];
}

export interface RawStudentData {
  id: string;
  nama: string;
  email?: string;
  gender: string;
  sekolah: number;
  personality: { [key: string]: number };
  aptitude: { [key: string]: number };
}

export interface ProcessedStudent {
  id: string;
  nama: string;
  gender: string;
  character: string;
  persona: string;
  talent: string[];
  major: string[];
}
