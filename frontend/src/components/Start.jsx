import React from "react";
import { useNavigate } from "react-router-dom";
const Start = () => {
  const navigate = useNavigate();

  return (
    <div
      className="backdrop-blur-md bg-white/30 p-4 rounded-2xl shadow-lg p-12 flex flex-col items-center justify-center w-[68%] min-h-[400px]"
      dir="rtl"
    >
      <img
        src="https://www.ppu.edu/p/sites/all/themes/ppu2018/logo.png"
        alt="Univ Logo"
        className="w-40 h-40 mb-8"
      />

      <h1 className="text-blue-700 text-2xl font-bold text-center mb-3">
        مراتبنا بالعلم نرفعها جنباً
      </h1>
      <p className="text-blue-700 text-xl text-center mb-10">
        مرحبا بك في مركز طلاب جامعة بوليتكنك فلسطين
      </p>

      <button
        onClick={() => navigate("/login")}
        className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-full hover:bg-gray-200 transition duration-300"
      >
        تسجيل الدخول
      </button>
    </div>
  );
};

export default Start;
