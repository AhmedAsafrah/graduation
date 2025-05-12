import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const tabs = [
    { name: "لوحة النتائج", path: "/leaderboard" },
    { name: "المناسبات", path: "/events" },
    { name: "الأندية", path: "/clubs" },
    { name: "الرئيسية", path: "/home" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white rounded-2xl shadow-md py-2 px-4 z-10">
      <div className="flex justify-between items-center">
        {/* Left Section: Notifications and Profile */}
        <div className="flex space-x-2">
          <button
            onClick={() => navigate("/notifications")}
            className="p-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-full hover:bg-gray-200 transition duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </button>
        </div>

        {/* Right Section: Tabs */}
        <div className="flex space-x-2 sm:space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)}
              className="px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition duration-200 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
