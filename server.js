const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddlewares");

const app = express();

// DataBase connectin
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, () => {
  console.log("database connected successfully");
});

// middlewares

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["localhost:3000/"],
    credentials: true,
  })
);

//Routes

app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.send("Home Page...");
});

const PORT = process.env.PORT || 5000;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`server running on ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
