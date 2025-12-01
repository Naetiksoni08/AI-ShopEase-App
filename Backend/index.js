require("dotenv").config();
const express = require("express");
const router = require("./routes/router");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;
const connectdb = require("./config/db");
const { auth: authMiddleware } = require("./middlewares/auth");
const paymentRoutes = require('./paymentapi/paymentapi');



connectdb();


app.use(cors());
app.use(express.json());


app.use("/api", router);
app.use("/api/payment", paymentRoutes);
//POST http://localhost:5001/api/payment/order

app.get("/health",(req,res)=>{
    res.status(200).send("server is running fine");
})


app.use("/", authMiddleware, (req, res) => {
    res.send("working fine");
})


app.listen(PORT, () => {
    console.log("Server is up at port", `${PORT}`);
})