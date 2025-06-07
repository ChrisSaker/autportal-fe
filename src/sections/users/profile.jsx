import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Post from "../../components/post";

const Profile = ({ user, Posts, role }) => {
  const [profileImageUrl, setProfileImageUrl] = useState(false);
  const [page, setPage] = useState(1); // 1: About, 2: Posts
  const [currentPostPage, setCurrentPostPage] = useState(1);
  const postsPerPage = 3;
  const navigate = useNavigate();

  const totalPages = Math.ceil(Posts.length / postsPerPage);
  const currentPosts = Posts.slice(
    (currentPostPage - 1) * postsPerPage,
    currentPostPage * postsPerPage
  );

  const contentRef = useRef(null);

  // Scroll to top when tab or post page changes
  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [page, currentPostPage]);

  return (
    <div className="max-w-xl mx-auto p-4" ref={contentRef}>
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-4">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <FontAwesomeIcon
            icon={faUser}
            className="h-12 w-12 text-green-500 bg-green-200 p-4 rounded-full"
            onClick={() => {
              navigate("/profile");
            }}
          />
        )}
        <h2 className="text-xl font-semibold mt-2">
          {user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.name}
        </h2>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-neutral-500 text-white rounded overflow-hidden">
        <button
          onClick={() => {
            setPage(1);
            setCurrentPostPage(1);
          }}
          className={`w-1/2 py-2 text-center font-semibold border-b-2 ${
            page === 1 ? `border-green-400` : `border-transparent`
          }`}
        >
          About
        </button>
        <button
          onClick={() => setPage(2)}
          className={`w-1/2 py-2 text-center font-semibold border-b-2 ${
            page === 2 ? `border-green-400` : `border-transparent`
          }`}
        >
          Posts
        </button>
      </div>

      {/* About Section */}
      {page === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700 border-t pt-4 mt-4">
          {role === "student" && (
            <>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Student ID</span>
                <span className="text-gray-800">{user.student_id}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Email</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Degree</span>
                <span className="text-gray-800">{user.degree}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Major</span>
                <span className="text-gray-800">{user.major}</span>
              </div>
            </>
          )}

          {role === "employer" && (
            <>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Industry</span>
                <span className="text-gray-800">{user.industry}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">Email</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
            </>
          )}

          {role === "instructor" && (
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Email</span>
              <span className="text-gray-800">{user.email}</span>
            </div>
          )}
        </div>
      ) : (
        <div>
          {currentPosts.length !== 0 && (
            <div>
              {/* Posts Section */}
              <div className="mt-10 space-y-4">
                {currentPosts.map((post, index) => (
                  <Post key={index} post={post} />
                ))}
              </div>

              <div className="flex justify-center mt-6 space-x-2 text-sm">
                <button
                  onClick={() =>
                    setCurrentPostPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPostPage === 1}
                  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPostPage(i + 1)}
                    className={`px-3 py-1 border rounded hover:bg-gray-100 ${
                      currentPostPage === i + 1
                        ? "bg-gray-200 font-semibold"
                        : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPostPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPostPage === totalPages}
                  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {currentPosts.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No posts available.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
