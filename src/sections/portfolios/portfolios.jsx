import { faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import AddPostModal from "../../components/modals/addPostModal";
import UsersCard from "../../components/usersCard";
import Portfolio from "../../components/portfolioCard";

const Portfolios = ({portfolios, users}) => {
  const [postOwnerFilterOpen, setPostOwnerFilterOpen] = useState(false);
  const [feedFilterOpen, setFeedFilterOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);

  const handleOwnerFilterClick = () => {
    setPostOwnerFilterOpen(!postOwnerFilterOpen);
    setFeedFilterOpen(false);
  };

  const handlePostModalClose = () => {
    setPostModalOpen(false);
  };

  const hasPosts = () => {
    return portfolios.length > 0;
  };

  return (
    <div className="flex flex-row justify-center bg-stone-100 p-5 gap-8">
      <div className="flex flex-col gap-4 hidden lg-home:flex">
        <UsersCard type="Companies" users={users.employers.data} />
        <UsersCard type="Alumnis" users={users.alumni.data} />
      </div>

      <div className="relative shrink w-[32rem]">
        {hasPosts() && (
          <div className="w-full flex flex-col gap-2">
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
                <span>All Faculties</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>
            {portfolios.map((item) => (
              <Portfolio portfolio={item} />
            ))}
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
        {!hasPosts() && (
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
      <AddPostModal isOpen={postModalOpen} onClose={handlePostModalClose} />
    </div>
  );
};

export default Portfolios;
