const express = require("express");
const mongoose = require("mongoose");
const blogRouter = require("./routes/blog");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/Blog";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/blog", blogRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
