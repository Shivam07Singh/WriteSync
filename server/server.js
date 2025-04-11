const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const documentRoutes = require('./routes/documents')
const userRoutes = require('./routes/users')

const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://writesync108.netlify.app",
  })
);

app.use(express.json());

const connectDb = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongooDB Connected");
  } catch (error) {
    console.log("MongoDB connection Error", error);
  }
};

connectDb();

app.use('/api/documents', documentRoutes)
app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))