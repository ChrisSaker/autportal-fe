import { useState } from "react";
import { faShareNodes, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faComment,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { format } from "date-fns";
import {
  getPortfolioById,
  viewPortfolio,
  addSuggestion,
  editSuggestion,
  getSuggestions,
  deleteSuggestion,
  sharePortfolio,
} from "../config/api";
import { useNavigate } from "react-router-dom";

const Portfolio = ({ portfolio }) => {
  const [commentsDropdownOpen, setCommentsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [newSuggestion, setNewSuggestion] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const navigate = useNavigate();

  const [editingSuggestionId, setEditingSuggestionId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [openSuggestionMenuId, setOpenSuggestionMenuId] = useState(null);
  const [suggestionToDeleteId, setSuggestionToDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCopiedPopup, setShowCopiedPopup] = useState(false);

  const userRole = localStorage.getItem("role")?.toLowerCase();

  const fetchSuggestions = async () => {
    try {
      const response = await getSuggestions(portfolio.id);
      setSuggestions(response.data.data || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleCommentsClick = () => {
    setCommentsDropdownOpen(!commentsDropdownOpen);
    if (!commentsDropdownOpen) fetchSuggestions();
  };

  const handleAddSuggestion = async () => {
    if (!newSuggestion.trim()) return;
    try {
      await addSuggestion(portfolio.id, { content: newSuggestion });
      setNewSuggestion("");
      fetchSuggestions();
    } catch (err) {
      console.error("Error adding suggestion:", err);
    }
  };

  const handleEditSuggestion = async (id) => {
    if (!editingText.trim()) return;
    try {
      await editSuggestion(id, { content: editingText });
      setEditingSuggestionId(null);
      setEditingText("");
      fetchSuggestions();
    } catch (err) {
      console.error("Error editing suggestion:", err);
    }
  };

  const handleDeleteSuggestion = async (id) => {
    try {
      await deleteSuggestion(id);
      fetchSuggestions();
    } catch (err) {
      console.error("Error deleting suggestion:", err);
    } finally {
      setShowDeleteModal(false);
      setSuggestionToDeleteId(null);
    }
  };

  const handleNavigateToPortfolio = async () => {
    try {
      const view = await viewPortfolio(portfolio.id);
      if (!view) console.warn("Failed to view portfolio.");
      const fullPortfolio = await getPortfolioById(portfolio.id);
      if (!fullPortfolio || !fullPortfolio.data) throw new Error("Not found.");
      navigate("/portfolio", { state: { portfolio: fullPortfolio.data.data } });
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
    }
  };

  const handleShareClick = async () => {
    try {
      const res = await sharePortfolio(portfolio.id);
      const fullUrl = `${window.location.origin}${res.data.shareUrl}`;
      setShareUrl(fullUrl);
      setOpenModal(true);
    } catch (err) {
      console.error("Error sharing portfolio:", err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setShowCopiedPopup(true);
    setTimeout(() => {
      setShowCopiedPopup(false);
      setOpenModal(false);
    }, 1000); // 1.5 seconds delay
  };

  const isSuggestionOwner = (suggestion) => {
    const currentUserId = parseInt(localStorage.getItem("id"), 10);
    return (
      suggestion.instructor_id === currentUserId && userRole === "instructor"
    );
  };

  const profileImage = localStorage.getItem("profile_url");

  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this suggestion?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteSuggestion(suggestionToDeleteId)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative max-w-lg bg-white rounded-lg flex flex-col shadow-md mt-5">
      <div className="flex flex-row justify-between p-4">
        <div className="flex flex-row gap-3">
          {portfolio.student.profile_url ? (
            <img
              src={`http://localhost:8080${portfolio.student.profile_url}`}
              alt="Profile"
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="rounded-xl bg-gray-200 w-16 h-16" />
          )}
          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              {portfolio.student.first_name} {portfolio.student.last_name}
            </span>
          </div>
        </div>
      </div>
<div
  className={`mt-4 relative h-56 rounded-xl overflow-hidden shadow-md flex items-center justify-center ${
    portfolio.general_image_URL ? "" : "bg-gray-200"
  }`}
  style={{
    backgroundImage: portfolio.general_image_URL
      ? `url(http://localhost:8080${portfolio.general_image_URL})`
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Overlay text */}
  <p className="p-4 text-lg font-medium bg-black bg-opacity-60 text-white rounded">
    {portfolio.general_description}
  </p>

  {/* Button */}
  <button
    onClick={handleNavigateToPortfolio}
    className="absolute bottom-4 right-4 bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded shadow hover:bg-gray-100"
  >
    + View Portfolio
  </button>
</div>

      <div className="flex flex-row justify-between p-4 text-sm text-gray-600 items-center">
        <div className="flex flex-row gap-2 items-center">
          <FontAwesomeIcon icon={faEye} />
          <span>
            {portfolio.views === 1
              ? `${portfolio.views} view`
              : `${portfolio.views} views`}
          </span>
        </div>
        <span>•</span>
        <div className="flex flex-row gap-2 items-center">
          <FontAwesomeIcon icon={faComment} />
          <span>
            {(suggestions.length === 0
              ? portfolio.recommendationCount
              : suggestions.length) === 1
              ? `1 suggestion`
              : `${
                  suggestions.length === 0
                    ? portfolio.recommendationCount
                    : suggestions.length
                } suggestions`}
          </span>
        </div>
      </div>
      <div className="flex flex-row justify-between p-4 text-sm border-t border-b text-gray-600 font-semibold">
        <div className="flex flex-row gap-2 items-center">
          <button
            onClick={handleCommentsClick}
            className="flex flex-row gap-2 items-center"
          >
            <FontAwesomeIcon icon={faComment} className="h-5 w-5" />
            <span>Suggest</span>
          </button>
        </div>
        <div
          onClick={handleShareClick}
          className="flex flex-row gap-2 items-center"
        >
          <FontAwesomeIcon icon={faShareNodes} className="h-5 w-5" />
          <span>Share portfolio</span>
        </div>
      </div>

      {commentsDropdownOpen && (
        <div className="flex flex-col w-full gap-6 p-4">
          <div className="flex flex-row gap-4 w-full justify-between">
            {userRole === "instructor" && (
              <>
                {profileImage && profileImage !== "null" ? (
                <img
                  src={`http://localhost:8080${profileImage}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <div className="bg-gray-200 border border-amber-50 w-12 h-12 rounded-lg"></div>
              )}
                <div className="flex border border-gray-300 w-5/6 rounded-lg overflow-hidden bg-white">
                  <input
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    type="text"
                    placeholder="Write a suggestion..."
                    className="flex-grow p-2 outline-none focus:border-green-500"
                  />
                  <button
                    onClick={handleAddSuggestion}
                    className="bg-green-500 text-white px-2 m-2 rounded"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </div>
              </>
            )}
          </div>

          {suggestions.map((suggestion, index) => (
            <div key={index} className="relative flex gap-2">
              {suggestion.user.profile_url !== null ? (
                <img
                  src={`http://localhost:8080${suggestion.user.profile_url}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200 rounded-xl">
                  {/*Image*/}
                </div>
              )}
              <div className="w-5/6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">
                    {suggestion.user.first_name && suggestion.user.last_name
                      ? `${suggestion.user.first_name} ${suggestion.user.last_name}`
                      : suggestion.user.name}
                  </span>
                  {isSuggestionOwner(suggestion) && (
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      onClick={() =>
                        setOpenSuggestionMenuId(
                          openSuggestionMenuId === index ? null : index
                        )
                      }
                    />
                  )}
                </div>

                {editingSuggestionId === suggestion.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="p-2 border rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSuggestion(suggestion.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingSuggestionId(null);
                          setEditingText("");
                        }}
                        className="px-3 py-1 bg-gray-300 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="p-4 bg-green-50 rounded">
                    {suggestion.content}
                  </p>
                )}

                <div className="text-gray-500 text-sm">
                  {format(new Date(suggestion.createdAt), "EEEE h:mmaaa")}
                </div>
              </div>

              {openSuggestionMenuId === index && (
                <ul className="absolute top-8 right-0 bg-white w-24 rounded-lg shadow-lg">
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setEditingSuggestionId(suggestion.id);
                      setEditingText(suggestion.content);
                      setOpenSuggestionMenuId(null);
                    }}
                  >
                    Edit
                  </li>
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSuggestionToDeleteId(suggestion.id);
                      setShowDeleteModal(true);
                      setOpenSuggestionMenuId(null);
                    }}
                  >
                    Delete
                  </li>
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Share Portfolio</h2>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <input
                type="text"
                value={shareUrl}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100"
              />
              <button
                onClick={handleCopy}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {showCopiedPopup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
          Link copied to clipboard!
        </div>
      )}

      {showDeleteModal && <DeleteConfirmModal />}
    </div>
  );
};

export default Portfolio;
