import { Router, Request, Response } from "express";
import { prisma } from "../../utilities/db";
import { body } from "express-validator";
import { handleErrors, isEventAvailable } from "../../utilities/middlewares";

const router = Router();

//* get all the upcoming  events

router.get("/upcoming", async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findMany({
      where: {
        isCompleted: false,
      },
    });
    !event
      ? res.status(404).json({
          ok: true,
          message: "could not find the events",
        })
      : res.status(200).json(event);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({ message: error });
  }
});

//* get all the past  events

router.get("/past", async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findMany({
      where: {
        isCompleted: true,
      },
    });
    !event
      ? res.status(404).json({
          ok: true,
          message: "could not find the events",
        })
      : res.status(200).json(event);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({ message: error });
  }
});

//* get one event

router.get("/:id", isEventAvailable, async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(event);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({ message: error });
  }
});

//* search an upcoming event

router.get("/search/upcoming/:query", async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findMany({
      where: {
        name: {
          contains: req.params.query,
          mode: "insensitive",
        },
        isCompleted: false,
      },
    });

    !event
      ? res.status(404).json({
          ok: true,
          message: "could not find the event",
        })
      : res.status(200).json(event);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({ message: error });
  }
});

//* search a past event

router.get("/search/past/:query", async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findMany({
      where: {
        name: {
          contains: req.params.query,
          mode: "insensitive",
        },
        isCompleted: true,
      },
    });

    !event
      ? res.status(404).json({
          ok: true,
          message: "could not find the event",
        })
      : res.status(200).json(event);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({ message: error });
  }
});

//* create an event

router.post(
  "/",
  body("name").isString(),
  body("description").isString(),
  body("venue").isString(),
  body("link").isString(),
  body("image").isString(),
  body("time").isString(),
  body("date").isString(),
  body("organizers").isString(),
  handleErrors,
  async (req: Request, res: Response) => {
    try {
      const event = await prisma.event.create({
        data: { ...req.body },
        select: {
          id: true,
          name: true,
          description: true,
          venue: true,
          link: true,
          image: true,
          time: true,
          date: true,
          isCompleted: true,
          organizers: true,
          duration: true,
          createdAt: true,
        },
      });

      !event
        ? res.status(404).json({
            ok: true,
            message: "could not create the user",
          })
        : res.status(200).json(event);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      res.status(500).json({ message: error });
    }
  }
);

//* update an event

router.put("/:id", isEventAvailable, async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.update({
      where: {
        id: req.params.id,
      },
      data: { ...req.body },
      select: {
        id: true,
        name: true,
        description: true,
        venue: true,
        link: true,
        image: true,
        time: true,
        date: true,
        isCompleted: true,
        organizers: true,
        duration: true,
        createdAt: true,
      },
    });

    !event
      ? res.status(404).json({
          ok: true,
          message: "could not update the event",
        })
      : res.status(200).json(event);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({ message: error });
  }
});

//* complete an event

router.put(
  "/complete/:id",
  isEventAvailable,
  async (req: Request, res: Response) => {
    try {
      const event = await prisma.event.update({
        where: {
          id: req.params.id,
        },
        data: {
          isCompleted: true,
        },
      });

      !event
        ? res.status(404).json({
            ok: true,
            message: "could not complete the event",
          })
        : res.status(200).json({
            ok: true,
            message: "event completed successfully",
          });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      res.status(500).json({ message: error });
    }
  }
);

//* start an event

router.put(
  "/start/:id",
  isEventAvailable,
  async (req: Request, res: Response) => {
    try {
      const event = await prisma.event.update({
        where: {
          id: req.params.id,
        },
        data: {
          isCompleted: false,
        },
      });

      !event
        ? res.status(404).json({
            ok: true,
            message: "could not start the event",
          })
        : res.status(200).json({
            ok: true,
            message: "event started successfully",
          });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      res.status(500).json({ message: error });
    }
  }
);

//* delete an event

router.delete("/:id", isEventAvailable, async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.delete({
      where: {
        id: req.params.id,
      },
    });

    !event
      ? res.status(404).json({
          ok: true,
          message: "could not delete the event",
        })
      : res.status(200).json({
          ok: true,
          message: "event deleted successfully",
        });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json({ message: error });
  }
});

export default router;
