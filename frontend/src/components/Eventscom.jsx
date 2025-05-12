import { useState } from "react";

const EventList = () => {
  const [selectedEventId, setSelectedEventId] = useState(null);

  const events = [
    { id: 1, name: "مهرجان الشباب السنوي", date: "2025-05-10" },
    { id: 2, name: "ورشة عمل البرمجة", date: "2025-05-15" },
    { id: 3, name: "مسابقة الرياضيات", date: "2025-05-20" },
    { id: 4, name: "ندوة الذكاء الاصdيييييطناعي", date: "2025-05-25" },
    { id: 5, name: "مؤتمر التكنولوجيا الحديثة", date: "2025-05-30" },
    { id: 6, name: "حفل تخرج الطلاب", date: "2025-06-05" },
    { id: 7, name: "معرض الفنون التشكيلية", date: "2025-06-10" },
    { id: 8, name: "سباق الجري السنوي", date: "2025-06-15" },
  ];

  const handleEventClick = (id) => setSelectedEventId(id);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full">
      <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4 text-right">
        الفعاليات القادمة
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event.id)}
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-start p-3 sm:p-4 rounded-lg cursor-pointer transition duration-200  gap-4 ${
              selectedEventId === event.id ? "bg-blue-100" : "bg-gray-50"
            }`}
          >
            <button className="mt-2 sm:mt-0 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition duration-200 w-full sm:w-auto">
              عرض التفاصيل
            </button>
            <div className="text-right w-full sm:w-auto">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                {event.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
