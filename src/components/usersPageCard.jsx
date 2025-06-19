import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faChevronDown,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import AddUserModal from "../components/modals/addUserModal";
import { deleteUser } from "../config/api";
import { useNavigate } from "react-router-dom";

const UsersPageCard = ({ type, users, pagination = {}, onPageChange }) => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleSuccess = () => {
    window.location.reload();
  };

  const { page = 1, limit = 10, total = 0 } = pagination;
  const totalPages = Math.ceil(total / limit);

  const DropdownButton = ({ label }) => (
    <button className="bg-white py-2 px-4 text-sm text-green-700 font-semibold flex items-center gap-2 rounded-lg border border-green-300 hover:bg-green-50 transition">
      <span>{label}</span>
      <FontAwesomeIcon icon={faChevronDown} />
    </button>
  );

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleNavigate = (user) => {
    const userRole = type.toLowerCase().slice(0, -1);
    navigate("/profile", {
      state: {
        userId: user.student_id || user.id,
        userRole,
      },
    });
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""} ${user.name || ""} ${user.email || ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="relative bg-white rounded-2xl flex flex-col gap-6 p-6 w-full max-w-[720px] min-w-[320px] shadow-lg">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{type}</h1>
        <div className="relative w-full max-w-xs">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            className="w-full bg-gray-100 rounded-lg border border-gray-300 pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            placeholder={`Search ${type}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label={`Search ${type}`}
          />
        </div>
      </div>

      {/* Filters and Add Button */}
      {/* Uncomment to use filters */}
      {/* <div className="flex flex-wrap gap-3">{renderDropdowns()}</div> */}

      <div className="flex justify-end">
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 text-sm font-semibold rounded-lg border border-green-600 bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 transition"
        >
          Add {type.toLowerCase().slice(0, -1)}
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {/* User List */}
      <div className="overflow-y-auto max-h-[40vh] custom-scrollbar rounded-lg border border-gray-200">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const id = user.id || user.student_id || user.instructor_id || user.email;
            return (
              <div
                key={id}
                className="flex justify-between items-center p-3 gap-3 hover:bg-green-50 transition relative"
              >
                {/* User info */}
                <div className="flex items-center gap-3 flex-grow min-w-0">
                  {user.profile_url ? (
                    <img
                      src={`http://localhost:8080${user.profile_url}`}
                      alt="Profile"
                      className="w-12 h-12 object-cover rounded-xl ring-1 ring-green-300 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-xl ring-1 ring-green-300 flex-shrink-0">
                      {/* Optionally add a placeholder icon */}
                    </div>
                  )}
                  <div className="truncate">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.first_name} {user.last_name} {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    className="cursor-pointer text-gray-600 hover:text-green-700 transition"
                    onClick={() => setOpenMenuId((prev) => (prev === id ? null : id))}
                    aria-haspopup="true"
                    aria-expanded={openMenuId === id}
                    aria-label="More actions"
                  />
                  <button
                    onClick={() => handleNavigate(user)}
                    className="flex items-center gap-2 text-sm rounded border border-gray-300 bg-white px-3 py-1 hover:bg-gray-100 transition"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Open Profile</span>
                  </button>
                </div>

                {/* Dropdown Menu */}
                {openMenuId === id && (
                  <ul
                    className="absolute top-full right-4 mt-2 w-28 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
                    role="menu"
                    aria-label="User actions"
                    onMouseLeave={() => setOpenMenuId(null)}
                  >
                    <li
                      tabIndex={0}
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditMode(true);
                        setShowAddUserModal(true);
                        setOpenMenuId(null);
                      }}
                      className="p-2 cursor-pointer hover:bg-green-100 focus:bg-green-100"
                      role="menuitem"
                    >
                      Edit
                    </li>
                    <li
                      tabIndex={0}
                      onClick={() => {
                        setUserToDelete(user);
                        setShowConfirmDelete(true);
                        setOpenMenuId(null);
                      }}
                      className="p-2 cursor-pointer hover:bg-red-100 focus:bg-red-100 text-red-600"
                      role="menuitem"
                    >
                      Delete
                    </li>
                  </ul>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400 py-8 text-sm select-none">
            No users found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-4 mt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-1 text-sm bg-gray-100 border rounded disabled:opacity-50 hover:bg-gray-200 transition"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-1 text-sm bg-gray-100 border rounded disabled:opacity-50 hover:bg-gray-200 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-full mx-4">
            <h2
              id="confirm-delete-title"
              className="text-lg font-semibold mb-4 text-gray-800"
            >
              Confirm Deletion
            </h2>
            <p className="text-sm mb-6 text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{userToDelete?.email}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteUser(
                      userToDelete.id || userToDelete.student_id,
                      type.toLowerCase().slice(0, -1)
                    );
                    setShowConfirmDelete(false);
                    setUserToDelete(null);
                    handleSuccess();
                  } catch (error) {
                    console.error("Failed to delete user:", error);
                    alert("An error occurred while deleting the user.");
                  }
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => {
          setShowAddUserModal(false);
          setIsEditMode(false);
          setSelectedUser(null);
        }}
        type={type}
        user={selectedUser}
        isEditMode={isEditMode}
        onPostSuccess={handleSuccess}
      />
    </div>
  );
};

export default UsersPageCard;
