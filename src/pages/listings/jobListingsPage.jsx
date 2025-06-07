import { useEffect, useState } from "react";
import Listings from "../../sections/listings/jobListings";
import { getAllListings, getAllAlumnis,
  getAllEmployers,
  getAllInstructors,
  getAllStudents, } from "../../config/api";

function JobListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState({
    students: [],
    instructors: [],
    alumni: [],
    employers: [],
  });

  useEffect(() => {
    document.title = "Job-Listings";

    const fetchlistings = async () => {
      try {
        const response = await getAllListings();
        if (response?.data?.data) {
          setListings(response.data.data);
        } else {
          console.warn("Unexpected response structure", response);
          setListings([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setListings([]);
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

    fetchlistings();
  }, []);

if (loading) return <div>Loading users...</div>;

  return <Listings listings={listings} users={usersData}/>;
}

export default JobListingsPage;
