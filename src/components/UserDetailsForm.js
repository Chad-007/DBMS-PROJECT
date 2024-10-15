import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const fitnessGoals = [
  "Weight Loss",
  "Muscle Gain",
  "Athletic",
  "Endurance",
  "Maintain Weight",
];

const UserDetails = ({ onSave }) => {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to get the token from local storage or context
  const getToken = () => {
    return localStorage.getItem("token"); // Adjust this based on where you store the token
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!name || !height || !weight || !goal) {
      setErrorMessage("Please fill out all fields.");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true); // Show loading state

    try {
      const token = getToken(); // Get the token

      const response = await axios.put(
        "http://192.168.46.122:7000/api/users/details",
        { name, height, weight, fitnessGoal: goal },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      if (response.status === 200) {
        onSave({ name, height, weight, goal });
      }
    } catch (error) {
      console.error("Error saving user details:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        setErrorMessage(
          `Failed to save user details: ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else {
        console.error("Error message:", error.message);
        setErrorMessage("Failed to save user details. Please try again.");
      }
      setOpenSnackbar(true);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Height (cm)"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          select
          label="Fitness Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          fullWidth
          required
          margin="normal"
        >
          {fitnessGoals.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Details"}
        </Button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserDetails;
