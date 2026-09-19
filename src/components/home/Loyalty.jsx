import { Link } from "react-router-dom";

const Loyalty = () => {
  return (
    <div
      id="main"
      className="flex flex-col-reverse md:flex-row bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <section className="flex w-full md:w-1/2 flex-col justify-center items-center md:items-start p-8 md:p-12 text-center md:text-left">
        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
          When you sign up, you'll receive{" "}
          <span className="font-bold text-gray-900">discounts</span> and build{" "}
          <span className="font-bold text-gray-900">points</span> to redeem for
          gift cards. Also, we can contact you regarding restocked or
          backordered items.
        </p>
        <Link to="/cart" className="mt-6 w-full md:w-auto">
          <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
            Login
          </button>
        </Link>
      </section>

      <section className="flex w-full md:w-1/2 justify-center items-center bg-blue-600 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-white px-4 text-center">
          Join our loyalty program
        </h2>
      </section>
    </div>
  );
};

export default Loyalty;
