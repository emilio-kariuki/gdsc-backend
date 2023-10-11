import { CronJob } from "cron";
import { prisma } from "../utilities/db";
import { firebase } from "../utilities/firebase";

export const eventJob = new CronJob(
  "*/10 * * * * *",
  async function () {
    const events = await prisma.event.findMany({
      where: {
        isCompleted: false,
      },
    });
    for (const event of events) {
      const title = event.name;
      const body = event.description;
      const minutes = await eventMinutes(event);
      if ( minutes === 1 || minutes === 60) {
        try {
          const message = {
            notification: {
              title: "Your Event is about to start in " + ` ${minutes} minutes`,
              body: title,
            },
          };
          const response = await firebase
            .messaging()
            .sendToTopic("tedting_cron", message);
      
          console.log("Successfully sent message:" + response);
        } catch (e) {
          console.log("error", e);
          
        }
      }
    }
  },
  null,
  true,
  "America/Los_Angeles"
);


export const completeEvent = new CronJob(
    "*/10 * * * * *",
    async function () {

    }
)

async function eventMinutes(event: any) {
    const date = new Date(event.date);

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours());

    const eventTimeTimestamp = date.getTime();
    const currentTimeTimestamp = currentTime.getTime();

    const difference = eventTimeTimestamp - currentTimeTimestamp;

    const minutes = Math.ceil(difference / (1000 * 60));
    console.log("the event is in " + minutes + " minutes");
    return minutes;
}
   