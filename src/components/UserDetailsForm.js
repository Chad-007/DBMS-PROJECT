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

const UserDetailsForm = ({ onSave }) => {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !height || !weight || !goal) {
      setErrorMessage("Please fill out all fields.");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);

    try {
      const token = getToken();

      const response = await axios.put(
        "https://dbms-project-1-rynu.onrender.com/api/users/details",
        { name, height, weight, fitnessGoal: goal },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onSave({ name, height, weight, goal });
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Error response:", error.response); // Debugging line
      setErrorMessage(
        `Failed to save user details: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
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

export default UserDetailsForm;
