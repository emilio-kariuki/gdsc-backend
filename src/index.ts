import express from "express";
import morgan from "morgan";
import cors from 'cors';
import UserRouter from "./routes/user/user";
import EventRouter from "./routes/event/event";
import GroupRouter from "./routes/group/group";
import SpaceRouter from "./routes/space/space";
import ReportRouter from "./routes/help/report";
import FeedbackRouter from "./routes/help/feedback";
import ResourceRouter from "./routes/resources/resources";
import NotificationRouter from "./routes/notifications/notifications";
import AuthRouter from "./routes/authentication/auth";
// import { eventJob, completeEvent } from "./cron_jobs/crons";
import dotenv from 'dotenv'
dotenv.config()

const app = express();

const port = 4000;

process.env.PORT = port.toString();

app.use(morgan("dev"));
app.use(express.json());
app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

app.all("/", (_req, res) => {
  res.send("Hello World!");
});

// eventJob.start();
// completeEvent.start();

app.use("/user", UserRouter);
app.use("/event", EventRouter);
app.use("/group", GroupRouter);
app.use("/twitter", SpaceRouter);
app.use("/report", ReportRouter);
app.use("/feedback", FeedbackRouter);
app.use("/resource", ResourceRouter);
app.use("/notification", NotificationRouter);
app.use("/auth", AuthRouter);

app.listen(port, () => {
  console.log("Server on port", port);
});
