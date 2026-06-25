import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleWeather } from "./routes/weather";
import { handleNews } from "./routes/news";
import { handleRecommendations, handleSearchMovies } from "./routes/movies";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/weather", handleWeather);
  app.get("/api/news", handleNews);
  app.get("/api/movies/recommendations", handleRecommendations);
  app.get("/api/movies/search", handleSearchMovies);

  return app;
}
