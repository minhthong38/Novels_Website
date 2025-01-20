require("dotenv").config();
const express = require("express");
const cors = require('cors');
const swagger = require("./src/swagger/swagger.js");
const { connectDB } = require("./src/database/db");
const port = process.env.PORT;

//ConnectDB
connectDB();

//Setup Swagger UI for BE
const app = express();
swagger(app);

//Middleware parse json
app.use(express.json());

app.use(cors());

//Import Route
app.use("/", require("./routes/hello"));
app.use("/", require("./routes/userRoute"));
app.use("/", require("./routes/itemRoute"));
app.use("/", require("./routes/orderRoute"));
app.use("/", require("./routes/categoryRoute"));
app.use("/", require("./routes/authRoute"));
app.get("/", (req, res) => {
	res.send("Hello World!");
});

//Listen
app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`);
});
