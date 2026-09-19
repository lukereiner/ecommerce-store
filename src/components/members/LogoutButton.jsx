import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/store");
  };

  return (
    <button
      className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm focus:outline-none"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;