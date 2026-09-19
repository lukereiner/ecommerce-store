import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div id="main" className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <section className="flex w-full md:w-1/2 justify-center items-center bg-blue-600 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white px-4 text-center">
          About Us
        </h2>
      </section>

      <section className="flex w-full md:w-1/2 flex-col justify-center items-center md:items-start p-8 md:p-12 text-center md:text-left">
        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
          We are a general store in your area{" "}
          <span className="font-bold text-gray-900">since 1979</span>. We carry
          all kinds of items you may need for your life, such as video game
          consoles, computers, and automobiles. Check out our catalog of items!
        </p>
        <Link to="/store" className="mt-6 w-full md:w-auto">
          <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
            Catalog
          </button>
        </Link>
      </section>
    </div>
  );
};

export default AboutUs;