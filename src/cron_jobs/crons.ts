import { CronJob } from 'cron';
import { prisma } from '../utilities/db.js';
import { firebase } from '../utilities/firebase.js';
import { redisClient } from '../utilities/redis.js';

const upcomingKey = 'upcoming';
export const eventJob = new CronJob(
  '*/60 * * * * *',
  async function () {
    let events;
    const cachedData = await (await redisClient).get(upcomingKey);

    if (cachedData) {
      events = JSON.parse(cachedData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      events = await prisma.event.findMany({
        where: {
          isCompleted: false
        }
      });
      await (
        await redisClient
      ).setEx(upcomingKey, 86400, JSON.stringify(events));
    }
    for (const event of events) {
      const title = event.name;
      const minutes = await eventMinutes(event);
      if (minutes === 1 || minutes === 60) {
        try {
          const message = {
            notification: {
              title: "Your event will start " + minutes + " minutes",
              body: title
            },
            android: {
              notification: {
                imageUrl: event.image
              }
            },
            topic: 'onesignal',
          };
          const response = await firebase
            .messaging()
            .send(message);
            

          console.log('Successfully sent message:' + response);
        } catch (e) {
          console.log('error', e);
        }
      }
    }
  },
  null,
  true,
  'America/Los_Angeles'
);

export const completeEvent = new CronJob('1 * * * * *', async function () {
  const events = await prisma.event.findMany({
    where: {
      isCompleted: false
    }
  });
  for (const event of events) {
    const id = event.id;
    const minutes = await eventMinutes(event);
    if (minutes === -119) {
      try {
        const eventUpdate = await prisma.event.update({
          where: {
            id: id
          },
          data: {
            isCompleted: true
          }
        });

        !eventUpdate
          ? console.log('event failed to complete')
          : console.log('event completed successfully');
      } catch (e) {
        console.log('error', e);
      }
    }
  }
});

async function eventMinutes(event: any) {
  const date = new Date(event.date);

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours());

  const eventTimeTimestamp = date.getTime();
  const currentTimeTimestamp = currentTime.getTime();

  const difference = eventTimeTimestamp - currentTimeTimestamp;

  const minutes = Math.ceil(difference / (1000 * 60));
  console.log(`the event + ${event.name} + is in ` + minutes + ' minutes');
  return minutes;
}
