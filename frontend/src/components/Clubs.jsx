import { useState } from 'react';
const SocialComponent = () => {
  const [likeCount, setLikeCount] = useState(0);
  const [followCount, setFollowCount] = useState(0);

  const handleLike = () => {
    setLikeCount(likeCount + 1);
  };

  const handleFollow = () => {
    setFollowCount(followCount + 1);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
      <div className="flex items-center mb-4">
        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Profile Icon" className="w-8 h-8 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">نادي شباب المستقبل</h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleLike}
          className="flex-1 bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition duration-200 flex items-center justify-center"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" alt="Like Icon" className="w-5 h-5 mr-2" />
          Like ({likeCount})
        </button>
        <button
          onClick={handleFollow}
          className="flex-1 bg-green-500 text-white rounded-lg py-2 px-4 hover:bg-green-600 transition duration-200 flex items-center justify-center"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png" alt="Follow Icon" className="w-5 h-5 mr-2" />
          Follow ({followCount})
        </button>
      </div>
    </div>
  );
};

export default SocialComponent;