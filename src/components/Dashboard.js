import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
          "http://192.168.46.122:7000/api/users/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {userData.name}!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your Plans
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="contained"
          component={Link}
          to="/workoutplans"
          color="primary"
        >
          View Workout Plans
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
          User Details
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
