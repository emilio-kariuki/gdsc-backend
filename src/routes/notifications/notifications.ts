import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { handleErrors } from "../../utilities/middlewares.js";
import { firebase } from "../../utilities/firebase.js";
import OneSignal from "@onesignal/node-onesignal";



const router = Router();



router.post(
  "/",
  body("name").isString(),
  body("content").isString(),
  body("image").isString(),
  body('topic').isString(),
  handleErrors,
  async (req: Request, res: Response) => {
    try {
      const message = {
        notification: {
          title: req.body.name,
          body: req.body.content,
        },
        android: {
          notification: {
            imageUrl: req.body.image,
          },
        },
        topic:req.body.topic,
      };
      const notification = await firebase.messaging().send(message);
      !notification
        ? res.status(500).json("event notification service encountered error")
        : res.status(200).json({
            ok: true,
            message: "event notification sent successfully",
          });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      res.status(500).json(error)

    }
  }
);


router.get('/users', async (_req: Request, res: Response) => {
  try {
    const firestore = firebase.firestore();
    const query = await firestore.collection('event').get();
    const data = query.docs.map((doc) => doc.data());

    res.json(data);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.json(error);
  }
});

export default router;


