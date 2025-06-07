import React, { useEffect, useState } from "react";
import Portfolios from "../../sections/portfolios/portfolios";
import {
  getAllPortfolios,
  getAllAlumnis,
  getAllEmployers,
  getAllInstructors,
  getAllStudents,
} from "../../config/api";

function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState({
    students: [],
    instructors: [],
    alumni: [],
    employers: [],
  });

  useEffect(() => {
    document.title = "Portfolios";

    const fetchPortfolios = async () => {
      try {
        const response = await getAllPortfolios();
        if (response?.data?.data) {
          setPortfolios(response.data.data);
        } else {
          console.warn("Unexpected response structure", response);
          setPortfolios([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPortfolios([]);
      }
    };

    async function fetchAllUsers() {
      try {
        const [students, instructors, alumni, employers] = await Promise.all([
          getAllStudents(),
          getAllInstructors(),
          getAllAlumnis(),
          getAllEmployers(),
        ]);

        setUsersData({
          students: students.data || [],
          instructors: instructors.data || [],
          alumni: alumni.data || [],
          employers: employers.data || [],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllUsers();
    fetchPortfolios();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600">Loading ...</span>
      </div>
    );
  }

  return <Portfolios portfolios={portfolios} users={usersData} />;
}

export default PortfoliosPage;
