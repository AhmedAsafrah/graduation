import React, { useState } from "react";
import buildingBackground from "../assets/background.jpg"; // Reuse the background image

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormFilled = formData.email && formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await fetch("/api/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });
    //   const data = await response.json();
    //   if (response.ok) {
    //     alert("Login successful!");
    //     window.location.href = "/dashboard";
    //   } else {
    //     alert("Login failed: " + data.message);
    //   }
    // } catch (error) {
    //   alert("Error: " + error.message);
    // }
    console.log("Login form submitted:", formData);
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${buildingBackground})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-800 bg-opacity-40"></div>

      {/* Form Container */}
      <div className="relative bg-white bg-opacity-95 p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-11/12 mx-auto block px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200 text-gray-700 placeholder-gray-400"
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-11/12 mx-auto block px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition duration-200 text-gray-700 placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!isFormFilled}
            className={`w-11/12 mx-auto block py-3 rounded-lg text-white font-semibold transition duration-300 ${
              isFormFilled
                ? "bg-green-600 hover:bg-green-700 hover:scale-105 hover:shadow-lg cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Log In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-green-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
