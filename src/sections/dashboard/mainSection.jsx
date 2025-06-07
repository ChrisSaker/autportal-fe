import { faImage } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronDown,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import AddPostModal from "../../components/modals/addPostModal";
import Post from "../../components/post";
import UsersCard from "../../components/usersCard";
import { getPosts } from "../../config/api";

const Main = ({ Posts, users }) => {
  const [activeItem, setActiveItem] = useState("allPosts");
  const [postOwnerFilterOpen, setPostOwnerFilterOpen] = useState(false);
  const [feedFilterOpen, setFeedFilterOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postContentDraft, setPostContentDraft] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

   const [searchQuery, setSearchQuery] = useState("");

  const [posts, setPosts] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("All Feed");
  const [sortBy, setSortBy] = useState("Most Recent");

  const contentRef = useRef(null);

  useEffect(() => {
    setPosts(Posts);
  }, [Posts]);

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

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleOwnerFilterClick = () => {
    setPostOwnerFilterOpen(!postOwnerFilterOpen);
    setFeedFilterOpen(false);
  };

  const handleFeedFilterClick = () => {
    setFeedFilterOpen(!feedFilterOpen);
    setPostOwnerFilterOpen(false);
  };

  const handleOwnerSelect = (type) => {
    setSelectedOwner(type);
    setPostOwnerFilterOpen(false);
  };

  const handleSortSelect = (type) => {
    setSortBy(type);
    setFeedFilterOpen(false);
  };

  const handlePostModalOpen = () => setPostModalOpen(true);
  const handlePostModalClose = () => setPostModalOpen(false);

  const handlePostSuccess = () => {
    setPostModalOpen(false);
    setPostContentDraft("");
    setShowSuccessPopup(true);
    fetchPosts();
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const hasPosts = () => posts.length > 0;

  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeItem, currentPage]);

  const filteredPosts = posts
    .filter((post) => {
      if (selectedOwner !== "All Feed" && post.user_role !== selectedOwner) {
        return false;
      }

      if (searchQuery.trim() !== "") {
        const content = post.content?.toLowerCase() || "";
        const title = post.title?.toLowerCase() || "";
        return content.includes(searchQuery.toLowerCase()) || title.includes(searchQuery.toLowerCase());
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Most Popular") {
        return (b.likeCount || 0) - (a.likeCount || 0);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div
      className="flex flex-row justify-center bg-stone-100 p-5 gap-8"
      ref={contentRef}
    >
      <div className="flex flex-col gap-4 hidden lg-home:flex">
        <UsersCard type="Companies" users={users.employers.data} />
        <UsersCard type="Alumnis" users={users.alumni.data} />
      </div>

      <div className="relative shrink w-[32rem] flex items-center">
        <div className="absolute top-0 w-full z-50">
          {showSuccessPopup && (
            <div className="bg-green-500 text-white text-center py-2 rounded shadow-lg mb-4">
              Post published successfully!
            </div>
          )}
        </div>

        {hasPosts() ? (
          <div className="flex flex-col gap-4 w-full">
            {/* Top Filters */}
            <div className="flex flex-row gap-6">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
                <input
                  type="text"
                  className="bg-gray-100 rounded-lg border border-gray-200 pl-10 py-2 focus:outline-none focus:border-green-500"
                  placeholder="I'm looking for..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="bg-white py-2 px-4 text-sm text-black font-semibold flex flex-row gap-2 items-center rounded-lg border border-gray-300"
                onClick={handleOwnerFilterClick}
              >
                <span>{selectedOwner}</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
              <button
                className="bg-white py-2 px-4 text-sm text-black font-semibold flex flex-row gap-2 items-center rounded-lg border border-gray-300"
                onClick={handleFeedFilterClick}
              >
                <span>{sortBy}</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>

            {/* Post Box */}
            <div className="bg-white rounded-lg flex flex-row gap-4 p-4 shadow-md">
              <div className="bg-gray-200 border border-amber-50 w-16 h-16 rounded-lg"></div>
              <div className="w-5/6 flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Start a post"
                  value={postContentDraft}
                  onChange={(e) => setPostContentDraft(e.target.value)}
                  className="h-16 w-full border border-gray-200 rounded-lg p-1 focus:outline-none focus:border-green-500"
                />
                <div className="flex flex-row gap-2">
                  <button
                    onClick={handlePostModalOpen}
                    className="flex items-center justify-center gap-3 w-full bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded-xl shadow-md transition duration-200"
                  >
                    <FontAwesomeIcon
                      icon={faImage}
                      className="text-green-600 text-lg"
                    />
                    <span className="text-sm">Share a Photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className="overflow-y-auto max-h-[100vh] pr-2">
              {filteredPosts.map((post) => (
                <Post key={post.id} post={post} onDelete={handleDeletePost} />
              ))}
            </div>

            {/* Owner Filter Dropdown */}
            {postOwnerFilterOpen && (
              <ul className="absolute top-12 left-36 bg-white w-48 rounded-lg shadow-lg z-50">
                {["All Feed", "student", "employer", "instructor", "alumni"].map(
                  (type) => (
                    <li
                      key={type}
                      className={`p-2 hover:bg-gray-100 cursor-pointer ${
                        selectedOwner === type ? "font-bold" : ""
                      }`}
                      onClick={() => handleOwnerSelect(type)}
                    >
                      {type}
                    </li>
                  )
                )}
              </ul>
            )}

            {/* Feed Filter Dropdown */}
            {feedFilterOpen && (
              <ul className="absolute top-12 right-0 bg-white w-48 rounded-lg shadow-lg z-50">
                {["Most Recent", "Most Popular"].map((type) => (
                  <li
                    key={type}
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${
                      sortBy === type ? "font-bold" : ""
                    }`}
                    onClick={() => handleSortSelect(type)}
                  >
                    {type}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 text-gray-400 text-center p-10">
            <img
              src="images/noPosts.png"
              alt="No Posts"
              className="w-32 h-32 m-auto"
            />
            <span className="text-xl font-bold">No Posts Yet</span>
            <span>
              Engage with the community to see the latest updates and shared
              posts here.
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 hidden lg-home:flex">
        <UsersCard
          type="Faculty of Applied Sciences"
          users={users.students.data}
        />
        <UsersCard type="Instructors" users={users.instructors.data} />
      </div>

      <AddPostModal
        isOpen={postModalOpen}
        onClose={handlePostModalClose}
        initialContent={postContentDraft}
        onPostSuccess={handlePostSuccess}
      />
    </div>
  );
};

export default Main;
