import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login';
import Navbar from './components/home/Navbar';
import './App.css'

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white flex-col">

      <div>
        <Navbar />
      </div>

      <h1 className="text-2xl font-extrabold text-sky-300 underline decoration-wavy">
        Vite + Tailwind v4 Working!
      </h1>

      <div>
        <nav>
          <Link className='underline' to="/login">Login</Link>
        </nav>
      </div>
    </div>
  );
}
