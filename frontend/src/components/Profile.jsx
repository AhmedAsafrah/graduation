import React, { useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa"; // Import icons for Edit and Save

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "محمد العقيلي",
    designation: "طالب جامعي",
    college: "جامعة بوليتكنك فلسطين",
    image:
      "https://scontent.fjrs23-1.fna.fbcdn.net/v/t39.30808-6/342986020_527725886005302_1086580091419382631_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1x5XRFxXMbgQ7kNvwFtyz_w&_nc_oc=AdnoriXQgOy5EvMh1-t89FtUiZVSSgH_qN_0IyS-BmTx14PzY88-zGfvjeXkrsynYFU&_nc_zt=23&_nc_ht=scontent.fjrs23-1.fna&_nc_gid=kP216pioYj1fRB_qHTd-PQ&oh=00_AfKacNN7ouUdT4QCwBjcy648cmcrjp3upcWD0LXzVvP49Q&oe=6827F141", // Replace with the user's image URL
    joinedClubs: ["نادي البرمجة", "نادي الرياضة", "نادي الفنون"],
    followedClubs: ["نادي العلوم", "نادي الهندسة"],
    highlights:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero.",
  });

  const [editableUser, setEditableUser] = useState({ ...user });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setUser(editableUser);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({
      ...editableUser,
      [name]: value,
    });
  };

  return (
    <div className="relative flex flex-col md:flex-row items-center bg-gray-100 p-8 rounded-lg shadow-lg max-w-7xl mx-auto">
      {/* Edit/Save Icon */}
      <button
        onClick={isEditing ? handleSaveClick : handleEditClick}
        className="absolute top-4 right-4 text-blue-500 hover:text-blue-700 transition"
      >
        {isEditing ? <FaSave size={20} /> : <FaEdit size={20} />}
      </button>

      {/* Left Section: Key Highlights and Clubs */}
      <div className="flex flex-col md:w-2/3 space-y-6">
        {/* Key Highlights */}
        <div className="bg-gray-200 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Key Highlights
          </h2>
          {isEditing ? (
            <textarea
              name="highlights"
              value={editableUser.highlights}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          ) : (
            <p className="text-gray-700">{user.highlights}</p>
          )}
        </div>

        {/* Clubs Section */}
        <div className="flex flex-col md:flex-row gap-6" dir="rtl">
          {/* Clubs I Joined */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              الأندية التي انضممت لها
            </h2>
            {isEditing ? (
              <textarea
                name="joinedClubs"
                value={editableUser.joinedClubs.join(", ")}
                onChange={(e) =>
                  setEditableUser({
                    ...editableUser,
                    joinedClubs: e.target.value
                      .split(",")
                      .map((club) => club.trim()),
                  })
                }
                className="w-full p-2 border rounded"
              />
            ) : (
              <ul>
                {user.joinedClubs.map((club, index) => (
                  <li key={index} className="text-gray-700">
                    {club}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Clubs I Follow */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              الأندية التي أتابعها
            </h2>
            {isEditing ? (
              <textarea
                name="followedClubs"
                value={editableUser.followedClubs.join(", ")}
                onChange={(e) =>
                  setEditableUser({
                    ...editableUser,
                    followedClubs: e.target.value
                      .split(",")
                      .map((club) => club.trim()),
                  })
                }
                className="w-full p-2 border rounded"
              />
            ) : (
              <ul>
                {user.followedClubs.map((club, index) => (
                  <li key={index} className="text-gray-700">
                    {club}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Right Section: User Image and Info */}
      <div className="flex flex-col items-center md:w-1/3 mt-6 md:mt-0 space-y-4">
        <div className="relative">
          <img
            src={user.image}
            alt="User Profile"
            className="w-48 h-48 rounded-full object-cover border-4 border-blue-500"
          />
        </div>
        {isEditing ? (
          <div className="space-y-4 w-full">
            <input
              type="text"
              name="name"
              value={editableUser.name}
              onChange={handleChange}
              className="text-xl font-bold text-gray-800 p-2 border rounded w-full"
            />
            <input
              type="text"
              name="designation"
              value={editableUser.designation}
              onChange={handleChange}
              className="text-gray-600 p-2 border rounded w-full"
            />
            <input
              type="text"
              name="college"
              value={editableUser.college}
              onChange={handleChange}
              className="text-gray-600 p-2 border rounded w-full"
            />
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-800 mt-4">
              {user.name}
            </h1>
            <p className="text-gray-600">{user.designation}</p>
            <p className="text-gray-600 text-sm">{user.college}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
