import React, { useEffect, useState } from "react";
import Users from "../../sections/users/users";
import {
  getAllStudents,
  getAllInstructors,
  getAllAlumnis,
  getAllEmployers
} from "../../config/api";

function UsersPage() {
  const [usersData, setUsersData] = useState({
    students: [],
    instructors: [],
    alumni: [],
    employers: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Users";

    async function fetchAllUsers() {
      try {
        const [students, instructors, alumni, employers] = await Promise.all([
          getAllStudents(),
          getAllInstructors(),
          getAllAlumnis(),
          getAllEmployers()
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
  }, []);

    if (loading) {
 return (
  <div className="flex flex-col justify-center items-center h-screen gap-4">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-gray-600">Loading profile data...</span>
  </div>
);
}

  return <Users users={usersData} />;
}

export default UsersPage;
