import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import WorkoutPlans from "./components/WorkoutPlans";
import ChatRoom from "./components/ChatRoom";
import ExerciseData from "./components/ExerciseData";
import NutritionPlans from "./components/NutritionPlans";
import UserDetailsPage from "./components/UserDetailsPage"; // Import the new component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workoutplans" element={<WorkoutPlans />} />
        <Route path="/exercisedata" element={<ExerciseData />} />
        <Route path="/chatroom" element={<ChatRoom />} />
        <Route path="/userdetails" element={<UserDetailsPage />} />{" "}
        {/* Use UserDetailsPage here */}
        <Route path="/nutritionplans" element={<NutritionPlans />} />
      </Routes>
    </Router>
  );
}

export default App;
