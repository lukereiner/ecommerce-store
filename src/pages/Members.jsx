import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import User from "../components/members/User";
import LogoutButton from "../components/members/LogoutButton";
import OrderHistory from "../components/orders/OrderHistory";

const Members = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* User Info Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <User />
          <div className="w-full sm:w-auto">
            <LogoutButton />
          </div>
        </div>

        {/* Order History Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <OrderHistory />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Members;