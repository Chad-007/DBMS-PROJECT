const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// App setup
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoURI =
  "mongodb+srv://alan:alan@cluster0.kgylo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Direct connection string

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process with failure
  });

// User schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  height: { type: Number },
  weight: { type: Number },
  fitnessGoal: { type: String },
  workoutPlan: { type: String },
  dietPlan: { type: String },
  progress: { type: Array, default: [] },
  goal: { type: String },
});

// Password hashing before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

// Helper function to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, "your_jwt_secret_here", { expiresIn: "30d" }); // Replace with your JWT secret
};

// Signup route
app.post("/api/users/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch user profile data
app.get("/api/users/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_here"); // Replace with your JWT secret
    const user = await User.findById(decoded.id).select("-password"); // Exclude password from the response
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Profile update route
app.put("/api/users/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_here"); // Replace with your JWT secret
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user information except password
    const { password, ...updateData } = req.body;
    if (password) {
      // Hash the new password if provided
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.id, updateData, {
      new: true,
      runValidators: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Details Route
// User Details Route
app.put("/api/users/details", async (req, res) => {
  try {
    // Assuming that the user ID is sent in the request body (you might want to adjust this according to your needs)
    const { userId, height, weight, fitnessGoal, workoutPlan, dietPlan } =
      req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { height, weight, fitnessGoal, workoutPlan, dietPlan },
      { new: true, runValidators: true }
    );

    // Respond with the updated user details
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch workout plans based on user goal
app.get("/api/workout-plans/:goal", async (req, res) => {
  const { goal } = req.params;

  // This is a mock implementation. Replace it with your actual workout plan logic.
  const workoutPlans = [
    {
      title: "Beginner Strength Training",
      exercises: ["Push-ups", "Squats", "Plank"],
    },
    {
      title: "Fat Loss Cardio",
      exercises: ["Running", "Jump Rope", "Burpees"],
    },
  ];

  const filteredPlans = workoutPlans.filter((plan) =>
    plan.title.includes(goal)
  );
  res.json(filteredPlans);
});

// Start server
const PORT = process.env.PORT || 7000; // You can set this to any port you want
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
