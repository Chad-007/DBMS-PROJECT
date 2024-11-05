const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoURI =
  "mongodb+srv://alan:alan@cluster0.kgylo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// User schema and model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  height: { type: Number },
  weight: { type: Number },
  fitnessGoal: { type: String },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

// Workout Plan schema and model
const workoutPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  goal: { type: String, required: true },
  description: { type: String },
  exercises: [{ type: String }],
});

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);

// Helper function to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, "your_jwt_secret_here", { expiresIn: "30d" });
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
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Profile update route
app.put("/api/users/details", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_here");
    const userId = decoded.id;

    const { name, height, weight, fitnessGoal } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, height, weight, fitnessGoal },
      { new: true, runValidators: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile route
app.get("/api/users/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_here");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Workout plans route
app.get("/api/workout-plans/:goal", async (req, res) => {
  const { goal } = req.params;

  try {
    const workoutPlans = await WorkoutPlan.find({ goal });
    res.json(workoutPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Insert sample workout plans (only run this once or adjust as needed)
const insertSampleWorkoutPlans = async () => {
  const samplePlans = [
    {
      title: "Fat Burning Workout",
      goal: "Weight Loss",
      description: "A great plan to burn calories quickly.",
      exercises: ["Jumping Jacks", "Burpees", "Mountain Climbers"],
    },
    {
      title: "Muscle Gain Plan",
      goal: "Muscle Gain",
      description: "Focused on building muscle mass.",
      exercises: ["Bench Press", "Squats", "Deadlifts"],
    },
  ];

  try {
    await WorkoutPlan.deleteMany(); // Clear existing plans
    await WorkoutPlan.insertMany(samplePlans);
    console.log("Sample workout plans inserted");
  } catch (error) {
    console.error("Error inserting workout plans:", error);
  }
};

// Uncomment to run this once to insert sample plans
// insertSampleWorkoutPlans();

// Start server
const PORT = 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
