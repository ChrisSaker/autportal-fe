import {
  faChevronDown,
  faFile,
  faPaperPlane,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import AddListingModal from "../../components/modals/addListingModal";
import UsersCard from "../../components/usersCard";
import ListingCard from "../../components/listingCard";

const Listings = ({ listings, users }) => {
  const [postOwnerFilterOpen, setPostOwnerFilterOpen] = useState(false);
  const [feedFilterOpen, setFeedFilterOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postContentDraft, setPostContentDraft] = useState("");

  const role = localStorage.getItem("role");

  const handleOwnerFilterClick = () => {
    setPostOwnerFilterOpen(!postOwnerFilterOpen);
    setFeedFilterOpen(false);
  };

  const handlePostModalClose = () => {
    setPostModalOpen(false);
  };

  const handlePostModalOpen = () => {
    setPostModalOpen(true);
  };

  const hasPosts = () => {
    return listings.length > 0;
  };

  return (
    <div className="flex flex-row justify-center bg-stone-100 p-5 gap-8">
      {/* Left Sidebar */}
      <div className="flex flex-col gap-4 hidden lg-home:flex">
        <UsersCard type="Companies" users={users.employers.data} />
        <UsersCard type="Alumnis" users={users.alumni.data} />
      </div>

      {/* Center Content */}
      <div className="relative shrink w-[32rem]">
        {hasPosts() && (
          <div className="w-full flex flex-col gap-2">
            {/* Search and Filter */}
            <div className="flex flex-row gap-6 hidden sm:flex justify-between">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
                <input
                  type="text"
                  className="bg-gray-100 rounded-lg border border-gray-200 pl-10 py-2 focus:outline-none focus:border-green-500"
                  placeholder="I'am looking for..."
                />
              </div>
              <button
                className="bg-white py-2 px-4 text-sm text-black font-semibold flex flex-row gap-2 items-center rounded-lg border border-gray-300"
                onClick={handleOwnerFilterClick}
              >
                <span>All Categories</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>

            {/* Share Listing Box */}
            {role === "employer" && (
              <div className="bg-white rounded-lg flex flex-row gap-4 p-4">
                <div className="bg-gray-200 border border-amber-50 w-16 h-16 rounded-lg"></div>
                <div className="w-5/6 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Share your listing"
                    value={postContentDraft}
                    onChange={(e) => setPostContentDraft(e.target.value)}
                    className="h-16 w-full border border-gray-200 rounded-lg p-1 focus:outline-none focus:border-green-500"
                  />
                  <div className="flex flex-row gap-2">
                    <button
                      onClick={handlePostModalOpen}
                      className="flex items-center justify-center gap-3 w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-xl shadow-md transition duration-200"
                    >
                      <FontAwesomeIcon
                        icon={faFile}
                        className="text-blue-600 text-lg"
                      />
                      <span className="text-sm">Share Listing</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Listings Scrollable Area */}
            <div className="overflow-y-auto max-h-[80vh] pr-2">
              {listings.map((item, index) => (
                <ListingCard key={index} listing={item} />
              ))}
            </div>

            {/* Filter Dropdown */}
            {postOwnerFilterOpen && (
              <ul className="absolute top-12 left-36 bg-white w-48 rounded-lg shadow-lg">
                <li className="flex flex-row gap-4 items-center justify-between p-2">
                  <span>All Faculties</span>
                  <input type="checkbox" className="h-4 w-4" />
                </li>
                <li className="flex flex-row gap-4 items-center justify-between p-2">
                  <span>Applied Sciences</span>
                  <input type="checkbox" className="h-4 w-4" />
                </li>
                <li className="flex flex-row gap-4 items-center justify-between p-2">
                  <span>Arts and Humanities</span>
                  <input type="checkbox" className="h-4 w-4" />
                </li>
                <li className="flex flex-row gap-4 items-center justify-between p-2">
                  <span>Business</span>
                  <input type="checkbox" className="h-4 w-4" />
                </li>
              </ul>
            )}
          </div>
        )}

        {/* No Posts Fallback */}
        {!hasPosts() && (
          <div className="flex flex-col gap-2 text-gray-400 text-center p-10">
            <img
              src="images/noPosts.png"
              alt="No Posts"
              className="w-32 h-32 m-auto"
            />
            <span className="text-xl font-bold">No Listingss Yet</span>
            <span>
              Engage with the community to see the latest updates and shared
              posts here.
            </span>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="flex flex-col gap-4 hidden lg-home:flex">
        <UsersCard
          type="Faculty of Applied Sciences"
          users={users.students.data}
        />
        <UsersCard type="Instructors" users={users.instructors.data} />
      </div>

      <AddListingModal isOpen={postModalOpen} onClose={handlePostModalClose} />
    </div>
  );
};

export default Listings;
