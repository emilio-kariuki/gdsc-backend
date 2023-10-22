import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import UserRouter from './routes/user/user.js';
import EventRouter from './routes/event/event.js';
import GroupRouter from './routes/group/group.js';
import SpaceRouter from './routes/space/space.js';
import ReportRouter from './routes/help/report.js';
import FeedbackRouter from './routes/help/feedback.js';
import ResourceRouter from './routes/resources/resources.js';
import NotificationRouter from './routes/notifications/notifications.js';
import AuthRouter from './routes/authentication/auth.js';
import dotenv from 'dotenv';
import { eventJob, completeEvent } from './cron_jobs/crons.js';
import swaggerUi from 'swagger-ui-express';
import {swagger} from './utilities/swagger.js';

dotenv.config();

export const app = express();

const port = 3000;

process.env.PORT = port.toString();

app.use(morgan('dev'));
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.all('/', (_req, res) => {
  res.send('Hello World!');
});

eventJob.start();
completeEvent.start();

app.use('/user', UserRouter);
app.use('/event', EventRouter);
app.use('/group', GroupRouter);
app.use('/twitter', SpaceRouter);
app.use('/report', ReportRouter);
app.use('/feedback', FeedbackRouter);
app.use('/resource', ResourceRouter);
app.use('/notification', NotificationRouter);
app.use('/auth', AuthRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swagger));

app.listen(port, () => {
  console.log('Server on port', port);
});
