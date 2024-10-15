import React, { useEffect, useState } from "react";
import axios from "axios";

const ExerciseData = () => {
  const [exerciseData, setExerciseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://192.168.46.122:7000/api/exercises",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExerciseData(response.data);
      } catch (error) {
        console.error("Error fetching exercise data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Exercise Data</h1>
      <ul>
        {exerciseData.map((exercise) => (
          <li key={exercise._id}>
            {exercise.name} - {exercise.duration} mins
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseData;
