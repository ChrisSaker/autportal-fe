import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  faEllipsis,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListingCard = ({ listing }) => {
  const [listingMenuOpen, setListingMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setListingMenuOpen(!listingMenuOpen);
  };

  const isOwner = () => {
    const userRole = localStorage.getItem("role")?.toLowerCase();
    const userId = parseInt(localStorage.getItem("id"), 10);
    return userRole === "employer" && listing.employer_id === userId;
  };

  const createdAt = listing.createdAt;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div className="relative max-w-lg bg-white rounded-xl shadow-md flex flex-col mb-6 border border-gray-200">
      {/* Header */}
      <div className="flex flex-row justify-between p-4">
        <div className="flex flex-row gap-3">
          <div className="rounded-xl bg-blue-900 w-16 h-16" />
          <div className="flex flex-col justify-center">
            <span className="text-lg font-semibold text-gray-900">
              {listing.employer.name}
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

      {/* Footer */}
      <div className="flex flex-row justify-end p-4 border-t text-sm text-gray-600 font-semibold">
        <a
          href={`mailto:${listing.employer.email}`}
          className="flex flex-row items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
          <span>Send Email</span>
        </a>
      </div>

      {/* Dropdown Menu */}
      {listingMenuOpen && (
        <ul className="absolute top-12 right-4 bg-white w-24 rounded-lg shadow-lg border border-gray-100 z-10">
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Edit</li>
          <li className="p-2 hover:bg-gray-100 cursor-pointer">Delete</li>
        </ul>
      )}
    </div>
  );
};

export default ListingCard;
