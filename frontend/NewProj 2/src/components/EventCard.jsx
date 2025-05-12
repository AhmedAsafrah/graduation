import React, { useState } from 'react';

const EventCard = () => {
  const [showMore, setShowMore] = useState(false);

  // Use a string for details instead of an array
  const details =
    "المؤتمر السنوي بنسخة الرابعة\nالأجندة :\n1- نص تجريبي.\n2- نص تجريبي.";

  // Helper function to render details as a paragraph
  const renderDetails = () => {
    // Show only the first two lines if not showMore
    if (!showMore) {
      const lines = details.split('\n');
      return (
        <p className="whitespace-pre-line">
          {lines.slice(0, 2).join('\n')}
        </p>
      );
    }
    // Show all details if showMore
    return <p className="whitespace-pre-line">{details}</p>;
  };

  return (
<div className="bg-white rounded-3xl shadow-md overflow-hidden w-[90%] max-w-[4xl] mx-auto my-8" dir="rtl">
    {/* Cover Photo */}
      <div className="relative">
        <img
          src="https://www.ppu.edu/p/sites/default/files/ppu-1714156162-118aabb4-40c7-4373-8f3a-127f4e52a705.jpeg"
          alt="Cover Photo"
          className="w-full h-[260px] sm:h-[320px] object-cover"
        />
      </div>

      {/* Event Info Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex-1 text-right">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            مؤتمر الطب في جامعة البوليتكنك
            <span className="text-lg text-gray-700 font-medium"> (24 نيسان)</span>
          </h2>
          <div className="text-base text-gray-700">
            بواسطة <span className="text-green-600 font-semibold">نادي كلية الطب</span>
          </div>
        </div>
      </div>

      {/* Details and Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 gap-4">
        <div className="flex-1 text-right">
          <div className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
            {renderDetails()}
            {!showMore && (
              <span>
                ...{' '}
                <button
                  onClick={() => setShowMore(true)}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  عرض المزيد
                </button>
              </span>
            )}
            {showMore && (
              <button
                onClick={() => setShowMore(false)}
                className="text-blue-600 underline hover:text-blue-800 ml-2"
              >
                عرض أقل
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventCard;