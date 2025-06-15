import { faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useMemo } from "react";
import AddPostModal from "../../components/modals/addPostModal";
import UsersCard from "../../components/usersCard";
import Portfolio from "../../components/portfolioCard";

const Portfolios = ({ portfolios, users }) => {
  const [postOwnerFilterOpen, setPostOwnerFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajors, setSelectedMajors] = useState([]);

  const handleOwnerFilterClick = () => {
    setPostOwnerFilterOpen(!postOwnerFilterOpen);
  };

  const toggleMajor = (major) => {
    setSelectedMajors((prev) =>
      prev.includes(major)
        ? prev.filter((m) => m !== major)
        : [...prev, major]
    );
  };

  const hasPosts = () => portfolios.length > 0;

  // Dynamic majors from portfolios, fallback to default majors if empty
  const defaultMajors = [
    "Accounting",
    "Economics",
    "Finance",
    "Hospitality Management",
    "Management",
    "Transport Management and Logistics",
    "Management Information Systems",
    "Marketing and Advertising",
    "Audiovisual Arts",
    "English Language and Literature",
    "Graphic Design",
    "Interior Design",
    "Journalism",
    "Public Relations",
    "Translation",
    "Computer Science",
    "Information Technology",
    "Nutrition and Dietetics",
    "Water Resources and Geo-Environmental Sciences",
  ];

  const majors = useMemo(() => {
    const foundMajors = portfolios
      .map((p) => p.student?.major)
      .filter(Boolean);
    const uniqueMajors = Array.from(new Set(foundMajors));
    return uniqueMajors.length > 0 ? uniqueMajors : defaultMajors;
  }, [portfolios]);

  const filteredPortfolios = portfolios.filter((portfolio) => {
    const { student } = portfolio;

    const matchesSearch =
      student?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMajor =
      selectedMajors.length === 0 || selectedMajors.includes(student?.major);

    return matchesSearch && matchesMajor;
  });

  return (
    <div className="flex flex-row justify-center bg-stone-100 p-5 gap-8">
      <div className="flex flex-col gap-4 hidden lg-home:flex">
        <UsersCard type="Employers" users={users.employers.data} />
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-100 rounded-lg border border-gray-200 pl-10 py-2 w-full focus:outline-none focus:border-green-500"
                  placeholder="I am looking for..."
                />
              </div>

              <button
                className="bg-white py-2 px-4 text-sm text-black font-semibold flex flex-row gap-2 items-center rounded-lg border border-gray-300"
                onClick={handleOwnerFilterClick}
              >
                <span>{selectedMajors.length === 0 ? "All Majors" : "Filter Applied"}</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>

            {filteredPortfolios.map((item) => (
              <Portfolio key={item.id} portfolio={item} />
            ))}

            {postOwnerFilterOpen && (
              <ul className="absolute top-12 left-36 bg-white w-72 max-h-64 overflow-y-auto rounded-lg shadow-lg z-10">
                {majors.map((major) => (
                  <li
                    key={major}
                    className="flex flex-row gap-4 items-center justify-between p-2"
                  >
                    <span>{major}</span>
                    <input
                      type="checkbox"
                      checked={selectedMajors.includes(major)}
                      onChange={() => toggleMajor(major)}
                      className="h-4 w-4"
                    />
                  </li>
                ))}
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
            <span className="text-xl font-bold">No Portfolios</span>
            <span>
              Engage with the community to see the latest updates and shared
              portfolios here.
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 hidden lg-home:flex">
        <UsersCard type="Students" users={users.students.data} />
        <UsersCard type="Instructors" users={users.instructors.data} />
      </div>
    </div>
  );
};

export default Portfolios;
