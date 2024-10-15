// Home.js
import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";

const Home = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Fitness App
      </Typography>
      <Typography variant="h6" gutterBottom>
        Please choose an option:
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/signup"
        >
          Sign Up
        </Button>
        <Button variant="outlined" color="primary" component={Link} to="/login">
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
