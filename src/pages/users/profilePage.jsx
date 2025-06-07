import React, { useEffect, useState } from "react";
import Profile from "../../sections/users/profile";
import { getProfilePosts, getUser } from "../../config/api";
import { useLocation } from 'react-router-dom';

function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const { state } = useLocation();

  const id = state.userId || localStorage.getItem("id");
  const role = state.userRole || localStorage.getItem("role");

  useEffect(() => {
    document.title = "Profile";

    const fetchPosts = async () => {
      try {
        const response = await getProfilePosts(id, role);
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

    const fetchUser = async () => {
      try {
        const response = await getUser(role, id);
        console.log("API Response for getUser:", response);

        if (response?.data?.data) {
          setUser(response.data.data);
        } else {
          console.warn("Unexpected response structure", response);
          setUser(null); 
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null); 
      }
    };

    fetchUser();
    fetchPosts();
  }, []);

  if (!user) {
 return (
  <div className="flex flex-col justify-center items-center h-screen gap-4">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-gray-600">Loading profile data...</span>
  </div>
);
}

  return <Profile user={user} Posts={posts} role={role} />;
}

export default ProfilePage;
