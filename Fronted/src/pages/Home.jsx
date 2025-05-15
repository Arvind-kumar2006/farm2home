import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-600">FarmConnect</div>
        <ul className="flex space-x-6 text-green-700 font-medium">
          <li><a href="#" className="hover:text-green-900">Home</a></li>
          <li><a href="#" className="hover:text-green-900">Farmer</a></li>
          <li><a href="#" className="hover:text-green-900">Buyer</a></li>
          <li><a href="/register" className="hover:text-green-900">Register</a></li>
          <li><a href="/login" className="hover:text-green-900">Login</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-gradient-to-br from-green-200 to-green-400">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">Connecting Farmers and Buyers Directly</h1>
          <p className="text-green-800 text-lg mb-6">
            FarmConnect helps you buy fresh produce directly from the source — local farmers.
            Cut the middlemen, support local agriculture, and enjoy fresh, affordable produce.
          </p>
          <a href="/register" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            Get Started
          </a>
        </div>
        <div className="md:w-1/2">
          <img src="https://img.freepik.com/free-vector/organic-farming-concept_23-2148433516.jpg?semt=ais_hybrid&w=740" alt="Farmer" className="w-full rounded-xl shadow-xl" />
        </div>
      </header>
    </div>
  );
}
