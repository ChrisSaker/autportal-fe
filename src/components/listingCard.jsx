import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  faEllipsis,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddListingModal from "./modals/addListingModal";
import { deleteListing } from "../config/api";

const ListingCard = ({ Listing, onDelete }) => {
  const [listingMenuOpen, setListingMenuOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [listing, setListing] = useState(Listing);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePostSuccess = (updatedListing) => { 
      setListing(updatedListing);
      setListingMenuOpen(false);
  }

   const confirmDeleteListing = async () => {
      try {
        const res = await deleteListing(listing.id);
        if (res?.data?.success) {
        setShowDeleteModal(false);
        if (onDelete) onDelete(listing.id);
      }
      } catch (error) {
        console.error("Error deleting listing", error);
      } finally {
        setShowDeleteModal(false);
      }
    };

  const handleMenuClick = () => {
    setListingMenuOpen(!listingMenuOpen);
  };

  const handlePostModalOpen = () => {
    setEditingListing(listing);
    setPostModalOpen(true);
  };

   const handlePostModalClose = () => {
    setPostModalOpen(false);
    setEditingListing(null);
  };

  const isOwner = () => {
    const userRole = localStorage.getItem("role")?.toLowerCase();
    const userId = parseInt(localStorage.getItem("id"), 10);
    return userRole === "employer" && Listing.employer_id === userId;
  };

  const createdAt = listing.createdAt;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  const profileURL = Listing.employer?.profile_url || null;

  return (
    <div className="relative max-w-lg bg-white rounded-xl shadow-md flex flex-col mb-6 border border-gray-200">
      {/* Header */}
      <div className="flex flex-row justify-between p-4">
        <div className="flex flex-row gap-3">
          {profileURL? (<img
                  src={`http://localhost:8080${profileURL}`}
                  alt="Profile"
                  className="w-16 h-16 rounded-xl object-cover"
                />) : (<div className="rounded-xl bg-gray-200 w-16 h-16" />)}
          <div className="flex flex-col justify-center">
            <span className="text-lg font-semibold text-gray-900">
              {Listing.employer.name}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isOwner() && (
            <button onClick={handleMenuClick} className="text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
          )}
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-4">
        <p className="text-xl font-semibold text-gray-900">{listing.title}</p>
        <p className="text-gray-700 leading-relaxed">{listing.description}</p>
        <div className="flex flex-col sm:flex-row sm:gap-6 text-sm text-gray-700">
          <span>
            <span className="font-medium text-gray-800">💰 Salary:</span> {listing.salary}
          </span>
          <span>
            <span className="font-medium text-gray-800">📍 Location:</span> {listing.location}
          </span>
        </div>
      </div>

      <div className="flex flex-row justify-end p-4 border-t text-sm text-gray-600 font-semibold">
        <a
          href={`mailto:${Listing.employer.email}`}
          className="flex flex-row items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
          <span>Send Email</span>
        </a>
      </div>

      {listingMenuOpen && (
        <ul className="absolute top-12 right-4 bg-white w-24 rounded-lg shadow-lg border border-gray-100 z-10">
          <li onClick={handlePostModalOpen} className="p-2 hover:bg-gray-100 cursor-pointer">Edit</li>
          <li 
          onClick={() => {
              setShowDeleteModal(true);
              setListingMenuOpen(false);
            }}
          className="p-2 hover:bg-gray-100 cursor-pointer text-red-600">Delete</li>
        </ul>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this listing?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteListing}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>)
      }

      <AddListingModal isOpen={postModalOpen} onClose={handlePostModalClose} listing={editingListing} onPostSuccess={handlePostSuccess}/>
    </div>
  );
};

export default ListingCard;
