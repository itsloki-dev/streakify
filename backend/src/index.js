import express from 'express';

const app = express();
const PORT = 3000;

// Sample data
const streakData = [
  { service: "LeetCode", streak: "3" },
  { service: "GitHub", streak: "7" },
  { service: "Duolingo", streak: "15" }
];

// Route
app.get('/get-data', (req, res) => {
  res.json({
    data: streakData
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
