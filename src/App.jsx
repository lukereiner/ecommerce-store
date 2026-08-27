import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Navbar from './components/home/Navbar';
import HomeHeader from './components/home/HomeHeader';
import FeaturedItems from './components/home/FeaturedItems';
import RecentlyAddedItems from './components/home/RecentlyAddedItems';
import AboutUs from './components/home/AboutUs';

export default function App() {
  return (
    <div className="">
        <Navbar />
        <HomeHeader />
        <FeaturedItems />
        <RecentlyAddedItems />
        <AboutUs />

    </div>
  );
}
