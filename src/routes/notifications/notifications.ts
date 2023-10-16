// import { Router, Request, Response } from "express";
// import { body } from "express-validator";
// import { handleErrors } from "../../utilities/middlewares.js";
// import { firebase } from "../../utilities/firebase.js";

// const router = Router();


// router.post(
//   "/event",
//   body("name").isString(),
//   body("content").isString(),
//   body("image").isString(),
//   handleErrors,
//   async (req: Request, res: Response) => {
//     try {
//       const message = {
//         notification: {
//           title: req.body.name,
//           body: req.body.content,
//         },
//         android: {
//           notification: {
//             imageUrl: req.body.image,
//           },
//         },
//         topic: "event",
//       };
//       const notification = await firebase.messaging().send(message);
//       !notification
//         ? res.status(500).json("event notification service encountered error")
//         : res.status(200).json({
//             ok: true,
//             message: "event notification sent successfully",
//           });
//     } catch (error) {
//       console.log("====================================");
//       console.log(error);
//       console.log("====================================");
//       res.status(500).json(error)

//     }
//   }
// );

// router.post(
//   "/announcement",
//   body("name").isString(),
//   body("content").isString(),
//   handleErrors,
//   async (req: Request, res: Response) => {
//     try {
//       const message = {
//         notification: {
//           title: req.body.name,
//           body: req.body.content,
//         },

//         topic: "announcements",
//       };
//       const notification = await firebase.messaging().send(message);
//       !notification
//         ? res
//             .status(500)
//             .json("announcement notification service encountered error")
//         : res.status(200).json({
//             ok: true,
//             message: "announcement notification sent successfully",
//           });
//     } catch (error) {
//       console.log("====================================");
//       console.log(error);
//       console.log("====================================");
//       res.status(500).json(error)

//     }
//   }
// );

// router.post(
//   "/updates",
//   body("name").isString(),
//   body("content").isString(),
//   handleErrors,
//   async (req: Request, res: Response) => {
//     try {
//       const message = {
//         notification: {
//           title: req.body.name,
//           body: req.body.content,
//         },

//         topic: "updates",
//       };
//       const notification = await firebase.messaging().send(message);
//       !notification
//         ? res.status(500).json("updates notification service encountered error")
//         : res.status(200).json({
//             ok: true,
//             message: "updates notification sent successfully",
//           });
//     } catch (error) {
//       console.log("====================================");
//       console.log(error);
//       console.log("====================================");
//       res.status(500).json(error)

//     }
//   }
// );

// router.get('/', async (_req: Request, res: Response) => {
//   try {
//     const firestore = firebase.firestore();
//     const query = await firestore.collection('event').get();
//     const data = query.docs.map((doc) => doc.data());

//     res.json(data);
//   } catch (error) {
//     console.log('====================================');
//     console.log(error);
//     console.log('====================================');
//     res.json(error);
//   }
// });

// export default router;


