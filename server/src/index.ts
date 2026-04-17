import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { profileRouter } from "./routes/profile";
import { planRouter } from "./routes/plan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors(
  {
    origin: [
      "http://localhost:5173",
      "https://gymmvp.vercel.app",
    ],
    credentials: true,
  }
));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "IRONMIND API",
  });
});

app.use("/api/profile", profileRouter)
app.use("/api/plan", planRouter);

app.listen(PORT, ()=> {
        console.log(`The server is running on PORT : ${PORT}`);
});