import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const UsersCard = ({ type, users }) => {
  const navigate = useNavigate();

  const handleNavigate = (user) => {
    const userRole = type.toLowerCase().slice(0, -1);
    navigate("/profile", {
      state: {
        userId: user.student_id || user.id,
        userRole,
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">{type}</h2>
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-800 transition"
        >
          See all <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* User List */}
      <div className="space-y-4">
        {users.length > 0 ? (
          users.slice(0, 5).map((user) => (
            <div
              key={user.id || user.student_id}
              className="flex flex-wrap justify-between items-center px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4 flex-grow min-w-[200px]">
                {user.profile_url ? (
                  <img
                    src={`http://localhost:8080${user.profile_url}`}
                    alt="Profile"
                    className="w-14 h-14 object-cover rounded-full ring-1 ring-gray-300"
                  />
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full text-xl ring-1 ring-gray-300">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 truncate max-w-xs">
                    {user.first_name} {user.last_name || user.name}
                  </p>
                  {user.email && (
                    <p className="text-sm text-gray-500 truncate max-w-xs">{user.email}</p>
                  )}
                </div>
              </div>

              {/* Open Button */}
              <div className="ml-6 mt-3 sm:mt-0 flex-shrink-0">
                <button
                  onClick={() => handleNavigate(user)}
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium text-black bg-white border border-black px-3 py-2 rounded-lg hover:bg-gray-100 transition w-full sm:w-auto justify-center"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Open
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-400">No users found</div>
        )}
      </div>
    </div>
  );
};

export default UsersCard;
