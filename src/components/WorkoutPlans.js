import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Button,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";

const WorkoutPlan = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [goal, setGoal] = useState(""); // Goal state
  const [anchorEl, setAnchorEl] = useState(null);

  // Map of goals to body parts
  const goalBodyPartsMap = {
    "Weight Loss": ["waist", "lower legs", "back"],
    "Muscle Gain": ["chest", "neck", "lower legs", "upper arms"],
    Athletic: ["shoulders", "cardio"],
    Endurance: ["waist"],
    "Maintain Weight": ["cardio", "back", "lower legs"],
  };

  // Fetch body parts
  const fetchBodyParts = async () => {
    try {
      const response = await axios.get(
        "https://exercisedb.p.rapidapi.com/exercises/bodyPartList",
        {
          headers: {
            "x-rapidapi-host": "exercisedb.p.rapidapi.com",
            "x-rapidapi-key":
              "e67228dd9cmsh82a99639e6738ebp179e6ajsna4df71a2050c", // Replace with your actual key
          },
        }
      );
      setBodyParts(response.data); // Store body parts
    } catch (error) {
      console.error("Error fetching body parts:", error);
      setError("Failed to fetch body parts. Please try again later.");
    }
  };

  // Fetch exercises based on body part
  const fetchExercises = async (bodyPart) => {
    try {
      const response = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}?limit=10&offset=0`,
        {
          headers: {
            "x-rapidapi-host": "exercisedb.p.rapidapi.com",
            "x-rapidapi-key":
              "e67228dd9cmsh82a99639e6738ebp179e6ajsna4df71a2050c", // Replace with your actual key
          },
        }
      );
      return response.data; // Return the exercise data
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setError("Failed to fetch exercises. Please try again later.");
      return [];
    }
  };

  // Fetch user data to get the fitness goal
  const fetchUserData = async () => {
    setLoading(true);
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

      console.log("Fetched user data:", response.data); // Debugging line
      setGoal(response.data.fitnessGoal); // Use fitnessGoal from user data
    } catch (error) {
      console.error(
        "Error fetching user data",
        error.response?.data || error.message
      );
      setError("Failed to fetch user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Create workout plan based on selected goal and body parts
  const createWorkoutPlan = useCallback(async () => {
    setLoading(true);
    setExercises([]); // Reset exercises before fetching

    if (goal) {
      const bodyPartsForGoal = goalBodyPartsMap[goal] || [];
      const promises = bodyPartsForGoal.map((bodyPart) =>
        fetchExercises(bodyPart)
      );

      const results = await Promise.all(promises);
      const allExercises = results.flat();
      setExercises(allExercises); // Set all fetched exercises
    }

    setLoading(false);
  }, [goal]); // Add goal to the dependency array

  // Divide exercises into a 6-day schedule
  const getWeeklySchedule = (exercises) => {
    const days = 6;
    const schedule = Array.from({ length: days }, () => []);
    exercises.forEach((exercise, index) => {
      schedule[index % days].push(exercise);
    });
    return schedule;
  };

  useEffect(() => {
    fetchBodyParts();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (goal) {
      createWorkoutPlan();
    }
  }, [goal, createWorkoutPlan]);

  const handleBodyPartSelect = (bodyPart) => {
    setSelectedBodyParts((prev) => {
      if (prev.includes(bodyPart)) {
        return prev.filter((part) => part !== bodyPart);
      } else {
        return [...prev, bodyPart];
      }
    });
  };

  const handleBodyPartClose = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  if (loading) return <CircularProgress />;

  const weeklySchedule = getWeeklySchedule(exercises);

  return (
    <Container sx={{ mt: 4, backgroundColor: "lightgreen", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Your Weekly Workout Plan
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Button variant="contained" onClick={handleOpenMenu}>
        Select Body Parts
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleBodyPartClose}
      >
        {bodyParts.map((bodyPart) => (
          <MenuItem
            key={bodyPart}
            onClick={() => handleBodyPartSelect(bodyPart)}
          >
            <input
              type="checkbox"
              checked={selectedBodyParts.includes(bodyPart)}
              readOnly
            />
            {bodyPart}
          </MenuItem>
        ))}
      </Menu>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {weeklySchedule.map((dayExercises, dayIndex) => (
          <Grid item xs={12} md={6} key={dayIndex}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Day {dayIndex + 1}</Typography>
              {dayExercises.length > 0 ? (
                dayExercises.map((exercise, index) => (
                  <Card variant="outlined" sx={{ my: 1 }} key={index}>
                    <CardContent>
                      <Typography variant="h5">{exercise.name}</Typography>
                      <Typography variant="body2">
                        Target Muscle: {exercise.target || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        Body Part: {exercise.bodyPart || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        Equipment: {exercise.equipment || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Sets/Reps: 3 sets of 10 reps
                      </Typography>
                      {exercise.gifUrl && (
                        <Box mt={2}>
                          <img
                            src={exercise.gifUrl}
                            alt={exercise.name}
                            style={{ width: "100%", borderRadius: "8px" }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography>No exercises for this day.</Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WorkoutPlan;
