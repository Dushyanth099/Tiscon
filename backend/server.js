import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import connectDB from "./config/db.js";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";

connectDB();
const app = express();
app.get("/", (req, res) => {
  res.send("Backend is running!");
});
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/delivery", deliveryRoutes);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://tiscon.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.options("*", cors());
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// if (process.env.NODE_ENV === "production") {
// app.use(express.static(path.join(__dirname, "/frontend/build")));
// //   app.get("*", (req, res) =>
// //     res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
// //   );
// // } else {
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
// });
// }

const PORT = process.env.PORT;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//runingin
