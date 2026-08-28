import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <>
      <div id="main" className="flex my-8">
        <section className="flex w-1/2 justify-center items-center bg-blue-400 rounded-md py-16">
          <div className="text-4xl font-bold px-4">About Us</div>
        </section>

        <section className="flex w-1/2 justify-center items-center flex-col py-2">
          <div className="px-8 text-center">
            We are a general store in your area <span className="font-bold">since 1979</span>. We carry all kinds of items you may need for your life, such as food, tools, and toiletries. Check out our catalog of items!
          </div>
          <Link to="/store">
            <button className="cursor-pointer px-4 py-1 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-50 mt-4">
              Catalog
            </button>
          </Link>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
