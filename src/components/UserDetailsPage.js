// UserDetailsPage.js
import React from "react";
import UserDetailsForm from "./UserDetailsForm";

const UserDetailsPage = () => {
  const handleSave = (details) => {
    console.log("User details saved:", details);
    // Here you can manage the saved user details as needed (e.g., update state or navigate)
  };

  return (
    <div>
      <h1>User Details</h1>
      <UserDetailsForm onSave={handleSave} />
    </div>
  );
};

export default UserDetailsPage;
