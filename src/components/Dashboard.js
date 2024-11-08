import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import animationData from "../assets/animation.json"; // Adjust the path if necessary
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://dbms-project-1-rynu.onrender.com/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Fetched user data:", response.data);

        setUserData(response.data);
      } catch (error) {
        console.error(
          "Error fetching user data",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <CircularProgress />;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Lottie options={defaultOptions} height={200} width={200} />
      <Typography variant="h4" gutterBottom>
        Welcome, {userData.name}!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your Profile
      </Typography>
      <Typography variant="body1">Height: {userData.height} cm</Typography>
      <Typography variant="body1">Weight: {userData.weight} kg</Typography>
      <Typography variant="body1">
        Fitness Goal: {userData.fitnessGoal}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          component={Link}
          to="/workoutplans"
          color="primary"
        >
          View Workout Plan
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/nutritionplans"
          color="secondary"
        >
          View Nutrition Plans
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/exercisedata"
          color="success"
        >
          View Exercise Data
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/chatroom"
          color="info"
        >
          Join Community
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/userdetails"
          color="secondary"
        >
          Update User Details
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
