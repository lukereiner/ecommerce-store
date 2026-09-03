import React from "react";
import { Link } from "react-router-dom";

const Loyalty = () => {
  return (
    <>
      <div id="main" className="flex my-8">
        <section className="flex w-1/2 justify-center items-center flex-col py-2">
          <div className="px-8 text-center">When you sign up, you'll receive <span className="font-bold">discounts</span> and build <span className="font-bold">points</span> to redeem for gift cards. Also, we can contact you regarding restocked or backordered items.</div>
          <Link to="/cart">
            <button className="cursor-pointer px-4 py-1 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-50 mt-4">
              Login
            </button>
          </Link>
        </section>

        <section className="flex w-1/2 justify-center items-center bg-blue-400 rounded-md py-16">
          <div className="text-center sm:text-2xl md:text-4xl lg:text-4xl font-bold px-4">Join our loyalty program</div>
        </section>
      </div>
    </>
  );
};

export default Loyalty;