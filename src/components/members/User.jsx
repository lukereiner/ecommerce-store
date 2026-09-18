import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";

const User = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <FaUserCircle className="h-16 w-16" />
      <div className="flex flex-col">
        <div>{`${user.firstname} ${user.lastname}`}</div>
        <div>{user.email}</div>
        <div>Member since: {formatDate(user.created)}</div>
      </div>
    </div>
  );
};

export default User;
