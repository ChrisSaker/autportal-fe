import UsersPageCard from "../../components/usersPageCard";

const Users = ({ users }) => {
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5 bg-stone-100">
      <div className="flex justify-center">
        <UsersPageCard type="Students" users={users.students.data} />
      </div>
      <div className="flex justify-center">
        <UsersPageCard type="Instructors" users={users.instructors.data} />
      </div>
      <div className="flex justify-center">
        <UsersPageCard type="Companies" users={users.employers.data} />
      </div>
      <div className="flex justify-center">
        <UsersPageCard type="Alumnis" users={users.alumni.data} />
      </div>
    </div>
  );
};

export default Users;
