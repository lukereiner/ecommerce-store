import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-gray-200 shadow text-black">
        <div className="w-1/3 flex justify-start">
          <Link to="/" className="text-xl font-bold">
            The General Store
          </Link>
        </div>

        <div className="w-1/3 flex justify-center space-x-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/cart" className="hover:text-blue-600">
            Members
          </Link>
          <Link to="/store" className="hover:text-blue-600">
            Store
          </Link>
        </div>

        <div className="w-1/3 flex justify-end space-x-4">
          <Link to="/cart">
            <FaShoppingCart className="hover:text-blue-600" color="green" size="2em" />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
