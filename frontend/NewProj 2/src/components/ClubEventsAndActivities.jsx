import React from 'react';

const ClubEventsAndActivities = () => {
  const events = [
    { id: 1, name: 'اليوم الطبي ', date: '23 يناير' },
    { id: 2, name: 'اليوم الطبي ', date: '23 يناير' },
    { id: 3, name: 'اليوم الطبي 6', date: '23 يناير' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-md p-4 w-[97%] mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">المناسبات والفعاليات الخاصة بالنادي</h2>
      {events.map((event) => (
        <div key={event.id} className="flex justify-between items-center py-2">
          <span className="text-lg font-semibold w-1/3">{event.name}</span>
          <span className="text-lg w-1/3 text-center">{event.date}</span>
          <button  className="w-1/4 text-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200">
            عرض التفاصيل
          </button>
        </div>
      ))}
    </div>
  );
};

export default ClubEventsAndActivities;