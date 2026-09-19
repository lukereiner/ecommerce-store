import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";

const User = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
      <FaUserCircle className="h-16 w-16 text-gray-400 flex-shrink-0" />
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-bold text-gray-900">
          {`${user.firstname} ${user.lastname}`}
        </h2>
        <p className="text-sm text-gray-600 font-medium">{user.email}</p>
        <p className="text-xs text-gray-400">
          Member since: {formatDate(user.created)}
        </p>
      </div>
    </div>
  );
};

export default User;