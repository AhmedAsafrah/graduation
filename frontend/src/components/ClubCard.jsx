import React from 'react';

const ClubCard = ({ onClick }) => {
  return (
    <div onClick={onClick} className="bg-white rounded-3xl shadow-md overflow-hidden">
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
         <div className="flex flex-row-reverse items-center justify-between px-8 pt-2 pb-8">
        <button className="px-10 py-3 bg-blue-600 text-white rounded-full text-xl font-semibold hover:bg-blue-700 transition duration-200">
          متابعة
        </button>
        <h3 className="text-3xl font-bold text-gray-800 text-center flex-1">
          نادي كلية الطب البشري
        </h3>
      </div>

      {/* Description */}
      <div className="px-8 pb-8">
        <p className="text-xl text-gray-800 text-center leading-relaxed">
          نادي كلية الطب البشري بالجامعة هذا نص تجريبي. نادي كلية الطب البشري بالجامعة هذا نص تجريبي. نادي كلية الطب البشري بالجامعة هذا نص تجريبي. نادي كلية الطب البشري بالجامعة هذا نص تجريبي.
        </p>
      </div>
    </div>
  );
};

export default ClubCard;