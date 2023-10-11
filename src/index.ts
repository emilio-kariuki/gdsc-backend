import express from "express";
import morgan from "morgan";
import UserRouter from "./routes/user/user";
import EventRouter from "./routes/event/event";
import GroupRouter from "./routes/group/group";
import SpaceRouter from "./routes/space/space";
import ReportRouter from "./routes/help/report";
import FeedbackRouter from "./routes/help/feedback";
import ResourceRouter from "./routes/resources/resources";
import NotificationRouter from "./routes/notifications/notifications";
import AuthRouter from "./routes/authentication/auth";
import { eventJob } from "./cron_jobs/crons";


const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.all("/", (req, res) => {
  res.send("Hello World!");
});

// eventJob.start();

app.use("/user", UserRouter);
app.use("/event", EventRouter);
app.use("/group", GroupRouter);
app.use("/twitter", SpaceRouter);
app.use("/report", ReportRouter);
app.use("/feedback", FeedbackRouter);
app.use("/resource", ResourceRouter);
app.use("/notification", NotificationRouter);
app.use("/auth", AuthRouter);

app.listen(3000, () => {
  console.log("Server on port 3000");
});
