import React from "react";

const topThree = [
  {
    name: "محمد أحمد",
    score: 10.456,
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "سارة علي",
    score: 10.205,
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "خالد يوسف",
    score: 8.589,
    img: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

const LeaderBoard = ({
  eventName = "مسابقة البرمجة",
  description = "أفضل ثلاثة طلاب في المسابقة بناءً على النقاط.",
}) => {
  return (
    <div className="w-full bg-gradient-to-b from-blue-500 to-white rounded-3xl shadow-lg p-12 min-h-[500px] text-white mt-10">
      <h2 className="text-3xl font-bold text-center mb-4">{eventName}</h2>
      <p className="text-center text-base mb-8 opacity-80">{description}</p>
      <div className="flex justify-center items-end gap-12 mb-8">
        {/* 2nd Place */}
        <div className="flex flex-col items-center group transition-transform duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer">
          <div className="w-20 h-20 rounded-full border-4 border-purple-300 overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-110">
            <img
              src={topThree[1].img}
              alt={topThree[1].name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold">{topThree[1].name}</span>
          <span className="text-yellow-200 font-bold">{topThree[1].score}</span>
          <span className="mt-1 text-lg font-bold">2</span>
        </div>
        {/* 1st Place */}
        <div className="flex flex-col items-center group transition-transform duration-300 hover:-translate-y-2 hover:scale-110 cursor-pointer">
          <div className="relative w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-110">
            <img
              src={topThree[0].img}
              alt={topThree[0].name}
              className="w-full h-full object-cover"
            />
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-3xl">
              👑
            </span>
          </div>
          <span className="font-semibold">{topThree[0].name}</span>
          <span className="text-yellow-300 font-bold">{topThree[0].score}</span>
          <span className="mt-1 text-lg font-bold">1</span>
        </div>
        {/* 3rd Place */}
        <div className="flex flex-col items-center group transition-transform duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer">
          <div className="w-20 h-20 rounded-full border-4 border-purple-300 overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-110">
            <img
              src={topThree[2].img}
              alt={topThree[2].name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold">{topThree[2].name}</span>
          <span className="text-yellow-200 font-bold">{topThree[2].score}</span>
          <span className="mt-1 text-lg font-bold">3</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
