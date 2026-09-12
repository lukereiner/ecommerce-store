import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import User from "../components/members/User";
import LogoutButton from "../components/members/LogoutButton";
import OrderHistory from "../components/orders/OrderHistory";

const Members = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />

      <section className="mx-6 flex items-center justify-between px-8 py-6 sm:flex-row sm:items-center sm:flex-col sm:justify-between">
        <User />
        <LogoutButton />
      </section>

      <section>
        <OrderHistory />
      </section>

      <Footer />
    </div>
  );
};

export default Members;
