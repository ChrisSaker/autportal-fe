import React, { useEffect, useState } from "react";
import Main from "../../sections/dashboard/mainSection";
import {
  getPosts,
  getAllAlumnis,
  getAllEmployers,
  getAllInstructors,
  getAllStudents,
} from "../../config/api";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState({
    students: [],
    instructors: [],
    alumni: [],
    employers: [],
  });

  useEffect(() => {
    document.title = "Home";

    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        if (response?.data?.data) {
          setPosts(response.data.data);
        } else {
          console.warn("Unexpected response structure", response);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
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

    fetchPosts();
  }, []);

    if (loading) {
 return (
  <div className="flex flex-col justify-center items-center h-screen gap-4">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-gray-600">Loading ...</span>
  </div>
);
}

  return <Main Posts={posts} users={usersData} />;
}

export default HomePage;
