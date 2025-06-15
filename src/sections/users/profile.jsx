import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCamera } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Post from "../../components/post";
import { updateProfile } from "../../config/api";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage"; // we'll define this below
import Modal from "react-modal";

const Profile = ({ user, Posts, role }) => {
  const [profileImageUrl, setProfileImageUrl] = useState(user.profile_url);
  const [page, setPage] = useState(1);
  const [currentPostPage, setCurrentPostPage] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role")?.toLowerCase();
  const userId = parseInt(localStorage.getItem("id"), 10);

  Modal.setAppElement('#root');

  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [page, currentPostPage]);

  const handleFileChange = async (e) => {
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

  const handleCropConfirm = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("profileUrl", croppedImageBlob, "profile.jpg");

      const res = await updateProfile(userRole, userId, formData);
      if (res.data.success) {
        setProfileImageUrl(res.data.data.profile_url);
        setCropModalOpen(false);
        setImageSrc(null);
      }
    } catch (error) {
      console.error("Crop/upload failed:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4" ref={contentRef}>
      {/* Profile Image with Camera Icon */}
      <div className="flex flex-col items-center mb-4 relative">
        <div className="relative w-24 h-24">
          {profileImageUrl ? (
            <img
              src={`http://localhost:8080${profileImageUrl}`}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              className="h-16 w-16 text-green-500 bg-green-200 p-4 rounded-full"
            />
          )}
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow"
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
        </div>

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

      {/* About or Posts Section */}
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
          {Posts.length !== 0 ? (
            <div className="overflow-y-auto max-h-[100vh] pr-2 pt-10 custom-scrollbar">
              {Posts.map((post, index) => (
                <Post key={index} post={post} />
              ))}
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
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setCropModalOpen(false)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCropConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
