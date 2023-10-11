import { Router, Request, Response } from "express";
import { prisma } from "../../utilities/db";
import { body } from "express-validator";
import { handleErrors, isSpaceAvailable } from "../../utilities/middlewares";

const router = Router();

//* create a twitter space

router.post(
  "/",
  body("name").isString(),
  body("link").isString(),
  body("image").isString(),
  body("start").isString(),
  body("end").isString(),
  body("date").isString(),
  handleErrors,
  async (req: Request, res: Response) => {
    try {
      const space = await prisma.space.create({
        data: {
          ...req.body,
        },
      });
      !space
        ? res.status(404).json({
            ok: true,
            message: "error creating twitter spaces",
          })
        : res.status(200).json(space);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      res.status(500).json(error)

    }
  }
);

//* get all the twitter spaces

router.get("/", async (req: Request, res: Response) => {
  try {
    const spaces = await prisma.space.findMany();
    !spaces
      ? res.status(404).json({
          ok: true,
          message: "error getting twitter spaces",
        })
      : res.status(200).json(spaces);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

//* get a particular twitter space

router.get("/:id", isSpaceAvailable, async (req: Request, res: Response) => {
  try {
    const space = await prisma.space.findUnique({
      where: {
        id: req.params.id,
      },
    });
    !space
      ? res.status(404).json({
          ok: true,
          message: "error getting this twitter space",
        })
      : res.status(200).json(space);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

//* update a twitter space

router.put("/:id", isSpaceAvailable, async (req: Request, res: Response) => {
  try {
    const space = await prisma.space.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...req.body,
      },
      select: {
        name: true,
        link: true,
        image: true,
        start: true,
        end: true,
        date: true,
      },
    });
    !space
      ? res.status(404).json({
          ok: true,
          message: "error updating this twitter space",
        })
      : res.status(200).json(space);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

//* delete a twitter space

router.delete("/:id", isSpaceAvailable, async (req: Request, res: Response) => {
  try {
    const space = await prisma.space.delete({
      where: {
        id: req.params.id,
      },
    });
    !space
      ? res.status(404).json({
          ok: true,
          message: "error deleting this twitter space",
        })
      : res.status(200).json(space);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

export default router;
