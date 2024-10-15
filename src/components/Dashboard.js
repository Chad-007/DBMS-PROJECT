import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [profileData, setProfileData] = useState({
    height: "",
    weight: "",
    fitnessGoal: "",
    workoutPlan: "",
    dietPlan: "",
  });

  const [progress, setProgress] = useState([]);
  const token = localStorage.getItem("token"); // Get token from localStorage

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfileData(response.data); // Load user profile data
        setProgress(response.data.progress); // Load progress data
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [token]);

  // Handle form changes
  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://192.168.46.122:7000/api/users/profile",
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  // Example: Add progress to the user's data
  const addProgress = async () => {
    const newProgress = prompt("Enter your progress update:");
    try {
      await axios.put(
        "http://192.168.46.122:7000/api/users/profile",
        {
          progress: [...progress, newProgress],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProgress([...progress, newProgress]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="height"
          placeholder="Height"
          value={profileData.height}
          onChange={handleChange}
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight"
          value={profileData.weight}
          onChange={handleChange}
        />
        <input
          type="text"
          name="fitnessGoal"
          placeholder="Fitness Goal"
          value={profileData.fitnessGoal}
          onChange={handleChange}
        />
        <input
          type="text"
          name="workoutPlan"
          placeholder="Workout Plan"
          value={profileData.workoutPlan}
          onChange={handleChange}
        />
        <input
          type="text"
          name="dietPlan"
          placeholder="Diet Plan"
          value={profileData.dietPlan}
          onChange={handleChange}
        />
        <button type="submit">Update Profile</button>
      </form>

      <h3>Progress:</h3>
      <ul>
        {progress.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button onClick={addProgress}>Add Progress</button>
    </div>
  );
};

export default Dashboard;
