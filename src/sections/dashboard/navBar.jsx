import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../guards/AuthContext";

const NavBar = () => {
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] =
    useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

   const [profileImageUrl, setProfileImageUrl] = useState(
    localStorage.getItem("profile_url")
  );

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "profile_url") {
        setProfileImageUrl(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleMenuDropdown = () => {
    setMenuDropdownOpen(!menuDropdownOpen);
    setNotificationsDropdownOpen(false);
  };

  const toggleNotificationsDropdown = () => {
    setNotificationsDropdownOpen(!notificationsDropdownOpen);
    setMenuDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRefreshProfile = () => {
  navigate("/home", { replace: true });

  setTimeout(() => {
    navigate("/profile", {
      state: {
        userId: localStorage.getItem("id"),
        userRole: localStorage.getItem("role"),
      },
    });
  }, 50);
};

  const menuItems = [
    { label: "Home", path: "/home" },
    { label: "Portfolios", path: "/portfolios" },
    { label: "Job Listings", path: "/jobs" },
    { label: "Users", path: "/users" },
  ];

  // Map current pathname to label
  const pathToLabelMap = {
    "/home": "Home",
    "/portfolios": "Portfolios",
    "/jobs": "Job Listings",
    "/users": "Users",
  };

  const currentPath = location.pathname;
  const active = pathToLabelMap[currentPath] || "";


  return (
    <div className="w-full bg-white flex flex-row justify-between items-center p-4 sm:p-8 m-0 relative">
      <div className="flex items-center">
        <img
          src="/images/Logo.png"
          alt="AUT"
          className="hidden sm:block w-24"
        />
        <FontAwesomeIcon
          icon={faBars}
          className={`h-7 w-7 block sm:hidden cursor-pointer ${
            menuDropdownOpen ? "text-green-400" : "text-gray-500"
          }`}
          onClick={toggleMenuDropdown}
        />
      </div>

      <div className="sm:hidden">
        <img src="/images/Logo.png" alt="Global Farms" className="h-12" />
      </div>

      <div className="flex flex-row justify-center items-center gap-8 relative">
        <ul className="flex flex-row space-x-4 hidden lg-home:flex">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className={`cursor-pointer px-2 py-1 rounded-lg ${
                active === item.label
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="mr-2">•</span> {item.label}
            </li>
          ))}
          <li
            className={`cursor-pointer px-2 py-1 rounded-lg ${
              currentPath === "/3d" // adjust if needed
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => navigate("/3d")}
          >
            <span className="mr-2">•</span> 3d Community
          </li>
        </ul>

        <FontAwesomeIcon
          icon={faBell}
          className={`h-7 w-7 cursor-pointer hidden sm:block ${
            notificationsDropdownOpen ? "text-green-400" : "text-gray-200"
          }`}
          //onClick={toggleNotificationsDropdown}
        />

        <div className="flex flex-row rounded-lg bg-white border border-slate-300 p-1 items-center gap-1 cursor-pointer">
          <FontAwesomeIcon
            icon={faBars}
            className={`h-7 w-7 hidden sm:block cursor-pointer mr-4 ${
              menuDropdownOpen ? "text-green-400" : "text-gray-500"
            }`}
            onClick={toggleMenuDropdown}
          />
          {profileImageUrl && profileImageUrl !== "null" ? (
            <img
              src={`http://localhost:8080${profileImageUrl}`}
              alt="Profile"
              className="h-10 w-10 rounded-full"
              onClick={handleRefreshProfile}
            />
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              className="h-6 w-6 text-green-500 bg-green-200 p-2 rounded-full"
              onClick={handleRefreshProfile}
            />
          )}
        </div>
      </div>

      {menuDropdownOpen && (
        <div className="absolute z-50 left-0 sm:right-0 sm:left-auto top-20 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg">
          <ul className="py-2">
            {menuItems.map((item) => (
              <li
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                }}
                className={`lg-home:hidden px-4 py-2 cursor-pointer ${
                  active === item.label ? "bg-green-400 text-white" : ""
                }`}
              >
                {item.label}
              </li>
            ))}
            <li
              onClick={() => navigate("/3d")}
              className={`lg-home:hidden px-4 py-2 cursor-pointer ${
                currentPath === "/3d" ? "bg-green-400 text-white" : ""
              }`}
            >
              3d Community
            </li>
            <li className="sm:hidden px-4 py-2 cursor-pointer">
              Notifications
            </li>
            <li className="px-4 py-2 cursor-pointer" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </div>
      )}

      {notificationsDropdownOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto top-20 mt-2 w-60 bg-white border border-gray-200 rounded shadow-lg">
          <ul className="py-2">
            <li className="px-4 py-2 cursor-pointer">Notification 1</li>
            <li className="px-4 py-2 cursor-pointer">Notification 2</li>
            <li className="px-4 py-2 cursor-pointer">Notification 3</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavBar;
