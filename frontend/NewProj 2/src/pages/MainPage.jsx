import Navbar from '../components/NavBar';
import Post from '../components/Post';
import EventList from '../components/Eventscom';
import SocialComponent from '../components/Clubs';

const MainPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="h-10 sm:h-20"></div>
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 sm:gap-8 px-2 sm:px-6 lg:px-10" dir="rtl">
        {/* Left Column (Posts) */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="rounded-3xl shadow-md p-2 sm:p-6 flex flex-col gap-4 sm:gap-6">
            <Post />
            <Post />
            <Post />
            <Post />
          </div>
        </div>
        {/* Right Column (Social + Events) */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="rounded-3xl shadow-md p-2 sm:p-6">
            <SocialComponent />
          </div>
          <div className="rounded-3xl shadow-md p-2 sm:p-6">
            <EventList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;