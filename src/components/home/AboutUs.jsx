import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <>
      <div id="main" className="flex ">
        <section className="flex w-1/2">
          <div>About Us</div>
        </section>

        <section className="flex w-1/2">
          <div>
            We are a general store in your area. Check out our catalog of items!
          </div>
          <Link to="/store">
            <button className="hover:text-blue-600 cursor-pointer">
              Catalog
            </button>
          </Link>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
