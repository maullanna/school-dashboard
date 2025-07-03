// src/App.tsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import SchoolSearch from "./components/SchoolSearch";
import DashboardPage from "./components/DashboardPage";
import type { School, Personality, Aptitude } from "./types";

import schoolsData from "./data/schools.json";
import personalitiesData from "./data/persoalities.json";
import aptitudesDataRaw from "./data/aptitudes.json";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage schools={schoolsData as School[]} />}
        />
        <Route
          path="/dashboard/:schoolId"
          element={
            <DashboardPage
              schools={schoolsData as School[]}
              personalities={
                (personalitiesData.personalities ?? []) as Personality[]
              }
              aptitudes={(aptitudesDataRaw.aptitudes ?? []) as Aptitude[]}
            />
          }
        />
      </Routes>
    </Router>
  );
};

const HomePage: React.FC<{ schools: School[] }> = ({ schools }) => {
  const navigate = useNavigate();
  const handleSchoolSelect = (school: School | null) => {
    if (school) {
      navigate(`/dashboard/${school.id}`);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <SchoolSearch schools={schools} onSchoolSelect={handleSchoolSelect} />
    </div>
  );
};

export default App;
