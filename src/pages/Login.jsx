import React, { useState } from 'react'
import LoginModal from '../components/login/LoginModal'
import RegisterModal from '../components/login/RegisterModal'

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      {/* Container Card */}
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
          <button
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
              activeTab === 'login'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
          <button
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
              activeTab === 'register'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Form Components */}
        {activeTab === 'login' ? (
          <LoginModal onSwitchToRegister={() => setActiveTab('register')} />
        ) : (
          <RegisterModal onSwitchToLogin={() => setActiveTab('login')} />
        )}
      </div>
    </div>
  )
}

export default Login