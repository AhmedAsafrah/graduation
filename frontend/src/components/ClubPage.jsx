import React from "react";

const ClubPage = () => {
  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden w-[91%] mx-auto">
      {/* Cover Photo */}
      <div className="relative">
        <img
          src="https://www.ppu.edu/p/sites/default/files/ppu-1714156162-118aabb4-40c7-4373-8f3a-127f4e52a705.jpeg"
          alt="Cover Photo"
          className="w-full h-48 object-cover"
        />
        {/* Personal Photo */}
        <div className="absolute bottom-0 right-8 translate-y-1/2">
          <img
            src="https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg"
            alt="Personal Photo"
            className="w-32 h-32 rounded-lg border-4 border-white object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Club Name and Follow Button */}
      <div className="flex flex-row-reverse items-center justify-between px-8 pt-2 pb-8 ">
        <h3 className="text-3xl font-bold text-gray-800 px-[150px]">
          نادي كلية الطب البشري
        </h3>
        <div className="flex gap-4">
          <button className="px-8 py-2 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center gap-2">
            <span>متابعة</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
          <button className="px-8 py-2 bg-green-500 text-white rounded-full text-lg font-semibold hover:bg-green-600 transition duration-200 flex items-center gap-2">
            <span>طلب انضمام</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="px-8 pb-8">
        <p className="text-xl text-gray-800  leading-relaxed " dir="rtl">
          نادي كلية الطب البشري بالجامعة هذا نص تجريبي. نادي كلية الطب البشري
          بالجامعة هذا نص تجريبي. نادي كلية الطب البشري بالجامعة هذا نص تجريبي.
          نادي كلية الطب البشري بالجامعة هذا نص تجريبي.
        </p>
      </div>
    </div>
  );
};

export default ClubPage;
