import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import {  useState } from "react"; 
import AddUserModal from "../components/modals/addUserModal"

const UsersPageCard = ({ type, users, pagination = {}, onPageChange }) => {

const [showAddUserModal, setShowAddUserModal] = useState(false);

  const { page = 1, limit = 10, total = 0 } = pagination;
  const totalPages = Math.ceil(total / limit);

  const DropdownButton = ({ label }) => (
    <button className="bg-white py-2 px-4 text-sm text-black font-semibold flex flex-row gap-2 items-center rounded-lg border border-gray-300">
      <span>{label}</span>
      <FontAwesomeIcon icon={faChevronDown} />
    </button>
  );

  const handleAddUser = () => { 
      setShowAddUserModal(true);
  }

  const handleClose = () => {
    setShowAddUserModal(false);
  }

  const renderDropdowns = () => {
    if (type === "Students") {
      return (
        <>
          <DropdownButton label="Major" />
          <DropdownButton label="Faculty" />
        </>
      );
    } else if (type === "Instructors") {
      return <DropdownButton label="Faculty" />;
    } else if (type === "Companies") {
      return <DropdownButton label="Industry" />;
    } else {
      return null;
    }
  };

  return (
    <div className="bg-white rounded-xl flex flex-col gap-6 p-6 w-[700px] max-w-[500px]">
      <div className="flex flex-row justify-between items-center gap-12 mb-4">
        <span className="text-lg font-semibold">{type}</span>
        <div className="relative w-full max-w-[220px]">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            className="w-full bg-gray-100 rounded-lg border border-gray-200 pl-10 py-2 focus:outline-none focus:border-green-500"
            placeholder={`Search ${type}`}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between">
      {renderDropdowns() && (
        <div className="flex flex-row flex-wrap gap-4 mb-4">
          {renderDropdowns()}
        </div>
      )}
      <button onClick={handleAddUser} className="flex flex-row gap-2 items-center text-sm rounded bg-white px-3 py-1 border border-gray-200 h-2/3">
        Add {type.toLowerCase().slice(0, -1)}
        <FontAwesomeIcon icon={faPlus} className="ml-2" />
      </button>
      </div>

      {users.length > 0 ? (
        users.map((user) => (
          <div
            key={user.id || user.student_id || user.instructor_id || user.email}
            className="flex flex-row gap-2 justify-between items-center"
          >
            <div className="flex flex-row gap-2">
               {user.profile_url !== null ? (
                <img
                  src={`http://localhost:8080${user.profile_url}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200 rounded-xl">
                  {/*Image*/}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold">
                  {user.first_name} {user.last_name} {user.name}
                </span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
            </div>
            <button className="flex flex-row gap-2 items-center text-sm rounded bg-white px-3 py-1 border border-gray-200 h-2/3">
              <FontAwesomeIcon icon={faPlus} />
              <span>Open Profile</span>
            </button>
          </div>
        ))
      ) : (
        <div className="text-center text-sm text-gray-500">No users found</div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-4 mt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-1 text-sm bg-gray-100 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-1 text-sm bg-gray-100 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      <AddUserModal isOpen={showAddUserModal} onClose={handleClose} type={type} />
    </div>
  );
};

export default UsersPageCard;
