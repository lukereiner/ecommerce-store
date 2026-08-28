import React from "react";

const Footer = () => {
  return (
    <footer className="w-full mt-auto">
      <div className="flex items-center justify-center gap-4 px-4 py-6">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} General Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;