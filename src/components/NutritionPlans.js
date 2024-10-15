import React, { useEffect, useState } from "react";
import axios from "axios";

const NutritionPlans = () => {
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNutritionPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://192.168.46.122:7000/api/nutrition-plans",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNutritionPlans(response.data);
      } catch (error) {
        console.error("Error fetching nutrition plans", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionPlans();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Your Nutrition Plans</h1>
      <ul>
        {nutritionPlans.map((plan) => (
          <li key={plan._id}>{plan.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default NutritionPlans;
