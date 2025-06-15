import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const UsersCard = ({ type, users }) => {
  const navigate = useNavigate();

  const handleNavigate = (user) => {
    const userRole = type.toLowerCase().slice(0, -1);
    console.log(userRole);

    navigate("/profile", {
      state: {
        userId: user.student_id ? user.student_id : user.id,
        userRole: userRole,
      },
    });
  };

  return (
    <div className="bg-white rounded-xl flex flex-col shadow-md gap-6 p-6">
      <div className="flex flex-row justify-between items-center gap-12 mb-4">
        <span className="text-lg font-semibold">{type}</span>
        <button
          onClick={() => {
            navigate("/users");
          }}
          className="flex flex-row gap-2 items-center text-sm rounded bg-amber-50 p-2"
        >
          See all
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      {users.length > 0 ? (
        users.map((user) => (
          <div className="flex flex-row gap-6 xl:gap-12 justify-between items-center">
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
              </div>
            </div>
            <button
              onClick={() => handleNavigate(user)}
              className="flex flex-row gap-2 items-center text-sm rounded bg-white px-3 py-1 border border-gray-200 h-2/3"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Open Profile</span>
            </button>
          </div>
        ))
      ) : (
        <div className="text-center text-sm text-gray-500">No users found</div>
      )}
    </div>
  );
};

export default UsersCard;
