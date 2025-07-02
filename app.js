import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import errorHandler from "./middlewares/ErrorHandler.js";
import hospitalRoutes from "./routes/hospital.routes.js";

const app = express();

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "too many requests please try again later",
  })
);

app.use(
  cors({
    origin: '*',
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use(express.json());
app.use(loggerMiddleware);
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));
app.use("/api/hospitals", hospitalRoutes);
app.use(errorHandler);
export default app;
