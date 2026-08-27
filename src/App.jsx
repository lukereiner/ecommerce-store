import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/home/Navbar';
import HomeHeader from './components/home/HomeHeader';
import './App.css'

export default function App() {
  return (
    <div className="">

      <div>
        <Navbar />
      </div>

      <div>
        <HomeHeader />
      </div>

    </div>
  );
}
