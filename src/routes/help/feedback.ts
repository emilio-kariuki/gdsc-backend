import { Router, Request, Response } from "express";
import { prisma } from "../../utilities/db";
import { body } from "express-validator";
import { isFeedbackAvailable } from "../../utilities/middlewares";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const feedback = await prisma.feedback.create({
      data: {
        ...req.body,
      },
    });
    !feedback
      ? res.status(404).json("error adding the feedback")
      : res.status(200).json({ ok: true, nessage: "feedback added succesfully" });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
});

//* get all the feedback

router.get("/", async (req: Request, res: Response) => {
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

router.delete("/:id", isFeedbackAvailable, async (req: Request, res: Response) => {
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
    res.status(500).json(error)

  }
});


export default router
