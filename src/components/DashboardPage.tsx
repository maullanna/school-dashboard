// src/components/DashboardPage.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/Config";

import type {
  School,
  RawStudentData,
  ProcessedStudent,
  Personality,
  Aptitude,
} from "../types";
import { processStudentData } from "../utils/dataProcessor";

const ExpandableText: React.FC<{ text: string; maxLength: number }> = ({
  text,
  maxLength,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  return (
    <div>
      <span>{isExpanded ? text : `${text.substring(0, maxLength)}...`}</span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-600 hover:text-blue-800 font-semibold ml-2 text-left"
      >
        {isExpanded ? "Sembunyikan" : "Baca Selengkapnya"}
      </button>
    </div>
  );
};

interface DashboardPageProps {
  schools: School[];
  personalities: Personality[];
  aptitudes: Aptitude[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  schools,
  personalities,
  aptitudes,
}) => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<ProcessedStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      schools.length === 0 ||
      personalities.length === 0 ||
      aptitudes.length === 0
    ) {
      setLoading(true);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setStudents([]);

      if (!schoolId) {
        setError("Tidak ada ID sekolah yang diberikan.");
        setLoading(false);
        return;
      }

      const schoolIdNumber = parseInt(schoolId);
      const currentSchool = schools.find((s) => s.id === schoolIdNumber);

      if (!currentSchool) {
        setError("Sekolah tidak ditemukan.");
        setLoading(false);
        return;
      }
      setSelectedSchool(currentSchool);

      try {
        const usersCollectionRef = collection(db, "users");
        const studentQuery = query(
          usersCollectionRef,
          where("sekolah", "==", schoolIdNumber)
        );
        const querySnapshot = await getDocs(studentQuery);

        if (!querySnapshot.empty) {
          const studentsList: RawStudentData[] = querySnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...(doc.data() as Omit<RawStudentData, "id">),
            })
          );
          const processedStudents = studentsList.map((student) =>
            processStudentData(student, personalities, aptitudes)
          );
          setStudents(processedStudents);
        } else {
          console.log(
            "Tidak ada data siswa ditemukan untuk sekolah ini di Firestore."
          );
        }
      } catch (err) {
        console.error("Error fetching data from Firestore:", err);
        let errorMessage = `Gagal memuat data siswa dari Firestore. Error: ${
          (err as Error).message
        }`;
        if ((err as Error).message.includes("indexes")) {
          errorMessage +=
            "\n\nPENTING: Firestore memerlukan indeks untuk query ini. Buka konsol browser (F12), cari pesan error dari Firestore, dan klik link yang diberikan untuk membuat indeks secara otomatis di Firebase Console.";
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId, schools, personalities, aptitudes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
          <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100 text-red-700 p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Dashboard Siswa
            </h1>
            <p className="mt-1 text-lg text-gray-600">
              {selectedSchool?.school_name}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-4 sm:mt-0 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Kembali
          </button>
        </div>

        <div className="w-full overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Nama",
                  "Gender",
                  "Character",
                  "Persona",
                  "Talent",
                  "Major",
                ].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {student.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      {student.character}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-sm">
                      <ExpandableText text={student.persona} maxLength={50} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                      <ol className="list-decimal list-inside">
                        {student.talent.map((t, index) => (
                          <li key={index}>{t}</li>
                        ))}
                      </ol>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                      <ol className="list-decimal list-inside">
                        {student.major.map((m, index) => (
                          <li key={index}>{m}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Tidak ada data siswa ditemukan untuk sekolah ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
