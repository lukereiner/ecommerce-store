import "./App.css";
import Navbar from "./components/home/Navbar";
import HomeHeader from "./components/home/HomeHeader";
import FeaturedItems from "./components/home/FeaturedItems";
import RecentlyAddedItems from "./components/home/RecentlyAddedItems";
import AboutUs from "./components/home/AboutUs";
import Loyalty from "./components/home/Loyalty";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4">
        <HomeHeader />
        <FeaturedItems />
        <RecentlyAddedItems />
        <AboutUs />
        <Loyalty />
      </main>

      <Footer />
    </div>
  );
}
