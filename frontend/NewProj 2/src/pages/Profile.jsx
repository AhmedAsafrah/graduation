import React from "react";
import Profile from "../components/Profile";
import NavBar from "../components/NavBar"; // Import the NavBar component

const ProfilePage = () => {
  return (
    <div>
      <NavBar /> {/* Render the NavBar */}
      <Profile />
    </div>
  );
};

export default ProfilePage;
