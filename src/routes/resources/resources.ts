import { Router, Request, Response } from "express";
import { prisma } from "../../utilities/db";
import { body } from "express-validator";
import { handleErrors, isResourceAvailable } from "../../utilities/middlewares";

const router = Router();

//* getting all the approved resources

router.get("/approved", async (_req: Request, res: Response) => {
  try {
    const resources = await prisma.resources.findMany({
      where: {
        isApproved: true,
      },
    });

    !resources
      ? res.status(404).json("error getting the resources")
      : res.status(200).json(resources);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

//* getting all the unapproved resources

router.get("/unapproved", async (_req: Request, res: Response) => {
  try {
    const resources = await prisma.resources.findMany({
      where: {
        isApproved: false,
      },
    });

    !resources
      ? res.status(404).json("error getting the resources")
      : res.status(200).json(resources);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

//* get one particular resource only

router.get("/:id", isResourceAvailable, async (req: Request, res: Response) => {
  try {
    const resource = await prisma.resources.findUnique({
      where: {
        id: req.params.id,
      },
    });

    !resource
      ? res.status(404).json("error getting the resource")
      : res.status(200).json(resource);
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

//* create a resource

router.post(
  "/",
  body("name").isString(),
  body("link").isString(),
  body("image").isString(),
  body("date").isString(),
  body("category").isString(),
  body("userId").isString(),
  handleErrors,
  async (req: Request, res: Response) => {
    try {
      const resource = await prisma.resources.create({
        data: {
          ...req.body,
        },
      });
      !resource
        ? res.status(404).json("error create the resource")
        : res.status(200).json({
            ok: true,
            message: {
              message: "resource created successfully",
              data: resource,
            },
          });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      res.status(500).json(error)

    }
  }
);

//* update a resource

router.put("/:id", isResourceAvailable, async (req: Request, res: Response) => {
  try {
    const resource = await prisma.resources.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...req.body,
      },
    });
    !resource
      ? res.status(404).json("error updating the resource")
      : res.status(200).json({
          ok: true,
          message: "resource updated successfully",
        });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

//* reject a resource

router.put("/reject/:id", isResourceAvailable, async (req: Request, res: Response) => {
  try {
    const resource = await prisma.resources.update({
      where: {
        id: req.params.id,
      },
      data: {
        isApproved: false,
      },
    });
    !resource
      ? res.status(404).json("error rejecting the resource")
      : res.status(200).json({
          ok: true,
          message: "resource rejected successfully",
        });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

//* approve a resource

router.put("/approve/:id", isResourceAvailable, async (req: Request, res: Response) => {
  try {
    const resource = await prisma.resources.update({
      where: {
        id: req.params.id,
      },
      data: {
        isApproved: true,
      },
    });
    !resource
      ? res.status(404).json("error approving the resource")
      : res.status(200).json({
          ok: true,
          message: "resource approved successfully",
        });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

//* delete a resourcee

router.delete("/:id", isResourceAvailable, async (req: Request, res: Response) => {
  try {
    const resource = await prisma.resources.delete({
      where: {
        id: req.params.id,
      },
    });
    !resource
      ? res.status(404).json("error deleting the resource")
      : res.status(200).json({
          ok: true,
          message: "resource deleted successfully",
        });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.status(500).json(error)

  }
});

export default router;