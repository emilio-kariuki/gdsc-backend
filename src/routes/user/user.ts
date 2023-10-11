import { Request, Response, Router } from "express";
import { prisma } from "../../utilities/db";
import { isUserAvailable } from "../../utilities/middlewares";

const router = Router();

//* get all the users

router.get("/", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        twitter: true,
      },
    });

    !user
      ? res.status(404).json("error getting the users")
      : res.status(200).json(user);
  } catch (e) {
    console.log("====================================");
    console.log(e);
    console.log("====================================");
    res.status(500).json(e)
  }
});

//* get a single user

router.get("/:id", isUserAvailable, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(user);
  } catch (e) {
    console.log("====================================");
    console.log(e);
    console.log("====================================");
    res.status(500).json(e)
  }
});

router.delete("/:id", isUserAvailable, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(user);
  } catch (e) {
    console.log("====================================");
    console.log(e);
    console.log("====================================");
    res.status(500).json(e)
  }
});
router.put("/password", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: {
        email: req.body.email,
      },
      data: {
        password: req.body.password,
      },
    });

    !user
      ? res.status(404).json("error updating  the password")
      : res.status(200).json(user);
  } catch (e) {
    console.log("====================================");
    console.log(e);
    console.log("====================================");
    res.status(500).json(e)
  }
});

//* make a user a admin

router.put(
  "/enableAdmin/:id",
  isUserAvailable,
  async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: {
          isAdmin: true,
        },
      });
      !user
        ? res.status(404).json("error creating the admin")
        : res.status(200).json(user);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      res.status(500).json(error)
    }
  }
);

//* disable a user a admin

router.put(
  "/disableAdmin/:id",
  isUserAvailable,
  async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.update({
        where: {
          id: req.params.id,
        },
        data: {
          isAdmin: false,
        },
      });
      !user
        ? res.status(404).json("error disabling the admin")
        : res.status(200).json(user);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      res.status(500).json(error)
    }
  }
);

//* getting the leads

router.get("/leads", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany({
      where: {
        isAdmin: true,
      },
    });
    !user
      ? res.status(404).json("error getting the admins")
      : res.status(200).json(user);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

export default router;
