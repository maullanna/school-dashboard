import React, { useState, useEffect, useMemo } from "react";
import type { School } from "../types";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface SchoolSearchProps {
  schools: School[];
  onSchoolSelect: (school: School | null) => void;
}

const SchoolSearch: React.FC<SchoolSearchProps> = ({
  schools,
  onSchoolSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isListVisible, setIsListVisible] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredSchools = useMemo(() => {
    if (!debouncedSearchTerm) return [];
    const lowercasedTerm = debouncedSearchTerm.toLowerCase();
    return schools
      .filter(
        (school) =>
          school.school_name.toLowerCase().includes(lowercasedTerm) ||
          school.city.toLowerCase().includes(lowercasedTerm) ||
          school.region.toLowerCase().includes(lowercasedTerm) ||
          school.village.toLowerCase().includes(lowercasedTerm)
      )
      .slice(0, 100);
  }, [debouncedSearchTerm, schools]);

  const handleSchoolClick = (school: School) => {
    onSchoolSelect(school);
    setSearchTerm(school.school_name);
    setIsListVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (newSearchTerm.trim() === "") onSchoolSelect(null);
    if (!isListVisible) setIsListVisible(true);
  };

  return (
    <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md relative">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Pilih Sekolah
      </h1>
      <input
        type="text"
        placeholder="Cari nama sekolah, kota, atau kecamatan..."
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsListVisible(true)}
      />
      {isListVisible && debouncedSearchTerm.length > 0 && (
        <div className="absolute z-10 w-[calc(100%-3rem)] mt-1 border border-gray-200 rounded-md bg-white shadow-lg max-h-72 overflow-y-auto">
          {filteredSchools.length > 0 ? (
            <div>
              {filteredSchools.map((school, index) => (
                <div
                  key={index}
                  className="p-3 border-b border-gray-100 cursor-pointer hover:bg-blue-100 flex flex-col"
                  onClick={() => handleSchoolClick(school)}
                >
                  <span className="font-semibold text-gray-800">
                    {school.school_name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {school.village}, {school.region}, {school.city}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 p-4">
              Tidak ada sekolah ditemukan.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolSearch;
