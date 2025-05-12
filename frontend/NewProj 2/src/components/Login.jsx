import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error message when user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "البريد الالكتروني مطلوب";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      console.log("Form submitted:", formData);
      navigate("/home");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-4xl lg:max-w-6xl backdrop-blur-lg bg-white/30 p-4 sm:p-5 rounded-xl">
        {/* Form Section */}
        <div
          dir="rtl"
          className="flex flex-col justify-center items-center w-full md:w-2/3 p-4 sm:p-6 md:p-8 min-h-[70vh]"
        >
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-base sm:text-lg font-medium text-black-700"
              >
                البريد الالكتروني
              </label>
              <input
                dir="rtl"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="قم بادخال الايميل الجامعي"
                className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base sm:text-lg font-medium text-black-700"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  dir="rtl"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="ادخل كلمة المرور"
                  className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 px-3 text-sm text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 sm:p-3 rounded hover:bg-blue-700 transition text-sm sm:text-base"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>

        {/* Logo Section (Unchanged) */}
        <div className="w-full md:w-1/3 bg-blue-800 flex flex-col p-4 items-center rounded-b-xl md:rounded-b-none md:rounded-r-xl py-4 sm:py-6">
          <div className="flex justify-center w-full mb-4 gap-0 bg-white p-1 mx-4 rounded-lg">
            <button className="flex-1 bg-blue-800 text-white px-4 py-2 rounded-l-lg text-sm sm:text-base">
              تسجيل الدخول
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex-1 bg-white text-blue-800 px-4 py-2 rounded-l-lg text-sm sm:text-base"
            >
              انشاء حساب
            </button>
          </div>

          <div className="h-full flex flex-col justify-center">
            <div className="flex flex-col items-center">
              <img
                src="https://www.ppu.edu/p/sites/all/themes/ppu2018/logo.png"
                alt="PPU Logo"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
              />
              <p className="text-white text-base sm:text-lg font-medium text-center px-2 mt-4">
                مركز طلاب جامعة بوليتكنك فلسطين
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
