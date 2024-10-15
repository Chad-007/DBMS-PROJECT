import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://192.168.46.122:7000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData(response.data);
      setUpdatedData(response.data); // Initialize updatedData with userData
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.put(
      "http://192.168.46.122:7000/api/users/profile",
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setEditMode(false);
    setUserData(updatedData);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={updatedData.name}
          onChange={handleChange}
          readOnly={!editMode}
        />
        <input
          type="email"
          name="email"
          value={updatedData.email}
          onChange={handleChange}
          readOnly={!editMode}
        />
        <button type="button" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit"}
        </button>
        {editMode && <button type="submit">Save</button>}
      </form>
    </div>
  );
};

export default UserProfile;
