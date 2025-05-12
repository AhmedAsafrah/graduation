import React from 'react';

const FollowedClubsCard = () => {
  const clubs = [
    { id: 1, name: 'نادي الطلاب', image: 'https://img.freepik.com/free-vector/group-people-illustration-collection_52683-33805.jpg' },
    { id: 2, name: 'نادي الطلاب', image: 'https://img.freepik.com/free-vector/group-people-illustration-collection_52683-33805.jpg' },
    { id: 3, name: 'نادي الطلاب', image: 'https://img.freepik.com/free-vector/group-people-illustration-collection_52683-33805.jpg' },
    { id: 4, name: 'نادي الطلاب', image: 'https://img.freepik.com/free-vector/group-people-illustration-collection_52683-33805.jpg' },
    { id: 5, name: 'نادي الطلاب', image: 'https://img.freepik.com/free-vector/group-people-illustration-collection_52683-33805.jpg' },
    { id: 6, name: 'نادي الطلاب', image: 'https://img.freepik.com/free-vector/group-people-illustration-collection_52683-33805.jpg' },  
  ];

  return (
    <div className="bg-white rounded-3xl shadow-md p-4">
      <h2 className="text-xl font-bold text-center mb-4">الاندية التي أتابعها</h2>
      {clubs.map((club) => (
        <div key={club.id} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <img
              src={club.image}
              alt={`${club.name} Logo`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-lg">{club.name}</span>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
            متابع
          </button>
        </div>
      ))}
    </div>
  );
};

export default FollowedClubsCard;