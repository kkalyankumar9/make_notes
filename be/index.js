const express = require("express");
const { connection } = require("./db");
const { userRoutes } = require("./routes/userRoutes");
const { notesRoutes } = require("./routes/notesRoutes");
const app = express();

app.use(express.json());
app.use("/users", userRoutes);
app.use("/notes", notesRoutes);

app.listen(8080, async () => {
  try {
    await connection;
    console.log("DB connected");
    console.log("Server is running  port 8080");
  } catch (error) {
    console.log(error);
  }
});
