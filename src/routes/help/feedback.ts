import { Router, Request, Response } from "express";
import { prisma } from "../../utilities/db.js";
import { isFeedbackAvailable } from "../../utilities/middlewares.js";
import { CourierClient } from "@trycourier/courier";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const feedback = await prisma.feedback.create({
      data: {
        ...req.body,
      },
    });
    if (!feedback) {
      res.status(404).json("error adding the feedback");
    }
    await feedbackEmail(req.body.email);
    res.status(200).json({ ok: true, nessage: "feedback added succesfully" });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
});

//* get all the feedback

router.get("/", async (_req: Request, res: Response) => {
  try {
    const reports = await prisma.feedback.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    !reports
      ? res.status(404).json("error getting the feedback")
      : res.status(200).json(reports);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
});

//* update a feedback

router.put("/:id", isFeedbackAvailable, async (req: Request, res: Response) => {
  try {
    const feedback = await prisma.feedback.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...req.body,
      },
    });
    !feedback
      ? res.status(404).json("error deleting the feedback")
      : res
          .status(200)
          .json({ ok: true, nessage: "feedback deleted succesfully" });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
});

//* delete a feedback

router.delete(
  "/:id",
  isFeedbackAvailable,
  async (req: Request, res: Response) => {
    try {
      const feedback = await prisma.feedback.delete({
        where: {
          id: req.params.id,
        },
      });
      !feedback
        ? res.status(404).json("error deleting the feedback")
        : res
            .status(200)
            .json({ ok: true, nessage: "feedback deleted succesfully" });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      res.status(500).json(error);
    }
  }
);

async function feedbackEmail(email: any) {
  try {
    const courier = CourierClient({
      authorizationToken: "pk_prod_GRZYXQV9SP46X4KTDBZ1MPBW6BP7",
    });

    const sent = await courier.send({
      message: {
        to: {
          email: email,
        },
        template: "8S3GHBQDSZMZ72MG9K2HBM1SPWKS",
        data: {
          email: "email",
        },
      },
    });

    !sent
      ? console.log("error sending the email")
      : console.log("email sent successfully");
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
}

export default router;
