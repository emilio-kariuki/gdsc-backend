import { Router, Request, Response } from "express";
import { prisma } from "../../utilities/db";
import { body } from "express-validator";
import { handleErrors, isGroupAvailable } from "../../utilities/middlewares";

const router = Router();

//* get all the groups

router.get("/", async (req: Request, res: Response) => {
  try {
    const groups = await prisma.groups.findMany();
    !groups
      ? res.status(404).json({
          ok: true,
          message: "error getting groups",
        })
      : res.status(200).json(groups);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});
//* get group by id

router.get("/:id", isGroupAvailable, async (req: Request, res: Response) => {
  try {
    const groups = await prisma.groups.findUnique({
      where: {
        id: req.params.id,
      },
    });
    !groups
      ? res.status(404).json({
          ok: true,
          message: "error getting groups",
        })
      : res.status(200).json(groups);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

//* create a group

router.post(
  "/",
  body("name").isString(),
  body("link").isString(),
  body("image").isString(),
  handleErrors,
  async (req: Request, res: Response) => {
    try {
      const groups = await prisma.groups.create({
        data: {
          ...req.body,
        },
      });
      !groups
        ? res.status(404).json({
            ok: true,
            message: "error creating group",
          })
        : res.status(200).json({
            ok: true,
            message: "group created successfully",
          });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      res.status(500).json(error)

    }
  }
);

//* update a group

router.put("/:id", isGroupAvailable, async (req: Request, res: Response) => {
  try {
    const group = await prisma.groups.update({
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
      },
    });

    !group
      ? res.status(404).json({
          ok: true,
          message: "error updating group",
        })
      : res.status(200).json(group);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

//* delete a group

router.delete("/:id", isGroupAvailable, async (req: Request, res: Response) => {
  try {
    const group = await prisma.groups.delete({
      where: {
        id: req.params.id,
      },
    });

    !group
      ? res.status(404).json({
          ok: true,
          message: "error deleting group",
        })
      : res.status(200).json({
        ok: true,
        message: "group deleted successfully"
      });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

export default router;
