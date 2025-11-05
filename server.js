const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes/routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

//DB Initialization or DB Connection
mongoose
  .connect(
    "mongodb+srv://ajayjoji1723:6idtjaVM6h7qB92i@cluster0.xs7ouo1.mongodb.net/goodreads?appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB error: ", err));

//Initialize the routes
app.use("/api", routes);
app.use("/auth", authRoutes);

app.listen(4444, () => console.log("Server runnning at 4444"));
