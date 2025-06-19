import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faUser, faCamera } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Post from "../../components/post";
import {
  updateProfile,
  viewPortfolio,
  getPortfolioById,
} from "../../config/api";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";
import Modal from "react-modal";

// Imports remain the same

const Profile = ({ user, Posts, role }) => {
  const [profileImageUrl, setProfileImageUrl] = useState(user.profile_url);
  const [page, setPage] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role")?.toLowerCase();
  const userId = parseInt(localStorage.getItem("id"), 10);

  Modal.setAppElement("#root");

  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [page]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleNavigateToPortfolio = async (id) => {
    try {
      const view = await viewPortfolio(id);
      if (!view) console.warn("Failed to view portfolio.");
      const fullPortfolio = await getPortfolioById(id);
      if (!fullPortfolio || !fullPortfolio.data) throw new Error("Not found.");
      navigate("/portfolio", { state: { portfolio: fullPortfolio.data.data } });
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
    }
  };

  const handleCropConfirm = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("image", croppedImageBlob, "profile.jpg");

      const res = await updateProfile(userRole, userId, formData);
      if (res.data.success) {
        setProfileImageUrl(res.data.data.profile_url);
        localStorage.setItem("profile_url", res.data.data.profile_url);
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "profile_url",
            newValue: res.data.data.profile_url,
          })
        );
        setCropModalOpen(false);
        setImageSrc(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("Crop/upload failed:", error);
    }
  };

  const _userId = user.id? user.id : user.student_id

  const isOwner = () => {
    const userRole = localStorage.getItem("role")?.toLowerCase();
    const userId = parseInt(localStorage.getItem("id"), 10);
    return userRole === role && _userId === userId;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6" ref={contentRef}>
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6 relative">
        <div className="relative w-28 h-28 group">
          {profileImageUrl ? (
            <img
              src={`http://localhost:8080${profileImageUrl}`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-green-500 shadow"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faUser}
                className="text-green-500 text-3xl"
              />
            </div>
          )}

        {isOwner() && (<div>
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100 transition"
          >
            <FontAwesomeIcon icon={faCamera} className="text-gray-700" />
          </label>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>)}
        </div>

        <h2 className="text-2xl font-semibold mt-3">
          {user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.name}
        </h2>
        <p className="text-gray-500 text-sm capitalize">{role}</p>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 bg-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setPage(1)}
          className={`w-1/2 py-2 font-semibold text-sm transition-all duration-200 ${
            page === 1
              ? "bg-green-500 text-white"
              : "text-gray-700 hover:bg-gray-300"
          }`}
        >
          About
        </button>
        <button
          onClick={() => setPage(2)}
          className={`w-1/2 py-2 font-semibold text-sm transition-all duration-200 ${
            page === 2
              ? "bg-green-500 text-white"
              : "text-gray-700 hover:bg-gray-300"
          }`}
        >
          Posts
        </button>
      </div>

      {/* Content */}
      {page === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 border-t pt-4">
          {role === "student" && (
            <>
              <ProfileField label="Student ID" value={user.student_id} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Degree" value={user.degree} />
              <ProfileField label="Major" value={user.major} />
              <div className="col-span-full">
                <button
                  onClick={() => handleNavigateToPortfolio(user.portfolioId)}
                  className="mt-2 w-full flex justify-center items-center gap-2 px-4 py-2 text-white bg-green-500 hover:bg-green-600 transition rounded-lg font-medium text-sm shadow"
                >
                  <FontAwesomeIcon icon={faFolderOpen} />
                  Open Portfolio
                </button>
              </div>
            </>
          )}
          {role === "employer" && (
            <>
              <ProfileField label="Industry" value={user.industry} />
              <ProfileField label="Email" value={user.email} />
            </>
          )}
          {role === "instructor" && (
            <ProfileField label="Email" value={user.email} />
          )}
        </div>
      ) : (
        <div>
          {Posts.length > 0 ? (
            <div className="mt-6 max-h-[80vh] overflow-y-auto px-2 custom-scrollbar">
              <div className="max-w-xl mx-auto space-y-4">
                {Posts.map((post, index) => (
                  <Post key={index} post={post} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No posts available.
            </div>
          )}
        </div>
      )}

      {/* Crop Modal */}
      <Modal
        isOpen={cropModalOpen}
        onRequestClose={() => setCropModalOpen(false)}
        className="bg-white p-4 rounded-lg w-full max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
      >
        <h2 className="text-lg font-semibold mb-2">Crop your image</h2>
        <div className="relative w-full h-60 bg-gray-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setCropModalOpen(false)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCropConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

// Subcomponent for consistent field layout
const ProfileField = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-800 break-words">{value}</span>
  </div>
);

export default Profile;
