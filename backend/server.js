const dotenv= require('dotenv').config();
const express = require('express');
const connectDB = require('./config/connectDB');
const Task = require("./model/taskModel");
const taskRoutes=require("./routes/taskRoute")
const cors=require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors(
  {origin:["http://localhost:3000","https://task-manager.onrender.com"]}
));
app.use(taskRoutes);

//Routes
app.get("/",(req,res)=>{
  res.send("HomePage");
});

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server due to DB error:', err);
    process.exit(1);
  }
})();
