import React, { useEffect, useState } from "react";
import axios from "axios";

const WorkoutPlans = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://192.168.46.122:7000/api/user-details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userDetails = response.data;
        // Logic to determine workout plans based on userDetails
        const workoutResponse = await axios.get(
          `http://192.168.46.122:7000/api/workout-plans/${userDetails.goal}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWorkoutPlans(workoutResponse.data);
      } catch (error) {
        console.error("Error fetching workout plans", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlans();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Workout Plans</h1>
      <ul>
        {workoutPlans.map((plan) => (
          <li key={plan._id}>{plan.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutPlans;
