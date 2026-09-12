import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/store");
  };

  return (
    <div>
      <button className="w-full px-4 rounded-lg bg-blue-600 py-2.5 text-sm font-mediym text-white hover:bg-blue-700 cursor-pointer transition" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
