import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { config } from "./config/env.js";

const app = express();

app.use(express.json());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow Postman and same-origin tools (no origin header)
    if (!origin) return callback(null, true);

    if (!config.allowedOrigins.length || config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  }
};

app.use(cors(corsOptions));

app.use("/api", routes);

// Error handler last
app.use(errorHandler);

export default app;
