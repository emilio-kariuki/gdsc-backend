import { Router, Request, Response } from 'express';
import { prisma } from '../../utilities/db';
import { body } from 'express-validator';
import { handleErrors, isResourceAvailable } from '../../utilities/middlewares';
import { redisClient } from '../../utilities/redis';

const router = Router();

const approvedKey = 'approved_resources';
const unapprovedKey = 'unapproved_resources';

//* getting all the approved resources

router.get('/approved', async (_req: Request, res: Response) => {
  try {
    const cacheData = await (await redisClient).get(approvedKey);
    let resources;

    if (cacheData) {
      resources = JSON.parse(cacheData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      resources = await prisma.resources.findMany({
        where: {
          isApproved: true
        }
      });
      await fetchResourceTable(approvedKey, true);
      console.log('====================================');
      console.log('from api');
      console.log('====================================');
    }

    !resources
      ? res.status(404).json('error getting the resources')
      : res.status(200).json(resources);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

//* getting all the unapproved resources

router.get('/unapproved', async (_req: Request, res: Response) => {
  try {
    const cacheData = await (await redisClient).get(unapprovedKey);
    let resources;

    if (cacheData) {
      resources = JSON.parse(cacheData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      resources = await prisma.resources.findMany({
        where: {
          isApproved: false
        }
      });
      await fetchResourceTable(unapprovedKey, false);
      console.log('====================================');
      console.log('from api');
      console.log('====================================');
    }

    !resources
      ? res.status(404).json('error getting the resources')
      : res.status(200).json(resources);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

//* get one particular resource only

router.get('/:id', isResourceAvailable, async (req: Request, res: Response) => {
  try {
    const resourceKey = `resource:${req.params.id}`;
    const cacheData = await (await redisClient).get(resourceKey);
    let resource;

    if (cacheData) {
      resource = JSON.parse(cacheData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      resource = await prisma.resources.findUnique({
        where: {
          id: req.params.id
        }
      });
      await (await redisClient).setEx(resourceKey, 86400, JSON.stringify(resource));
      console.log('====================================');
      console.log('from api');
      console.log('====================================');
    }

    !resource
      ? res.status(404).json('error getting the resource')
      : res.status(200).json(resource);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

//* create a resource

router.post(
  '/',
  body('name').isString(),
  body('link').isString(),
  body('image').isString(),
  body('category').isString(),
  body('userId').isString(),
  handleErrors,
  async (req: Request, res: Response) => {
    try {
      const resource = await prisma.resources.create({
        data: {
          ...req.body
        },
        select:{
          id: true,
          name: true,
          link: true,
          image: true,
          isApproved: true,
          category: true,
          userId: true
        }
      });
      if (!resource) {
        res.status(404).json('error create the resource');
      }
      await refreshApprovedTable();
      await refreshUnapprovedTable();
      res.status(200).json({
        ok: true,
        message: {
          message: 'resource created successfully',
          data: resource
        }
      });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json(error);
    }
  }
);
// TODO asafasdf
//* update a resource

router.put('/:id', isResourceAvailable, async (req: Request, res: Response) => {
  try {
    const resourceKey = `resource:${req.params.id}`;
    const resource = await prisma.resources.update({
      where: {
        id: req.params.id
      },
      data: {
        ...req.body
      }
    });
    if (!resource) {
      res.status(404).json('error updating the resource');
    }
    await (await redisClient).del(resourceKey);
    await refreshApprovedTable();
    await refreshUnapprovedTable();

    res.status(200).json({
      ok: true,
      message: 'resource updated successfully',
      data: resource
    });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

//* reject a resource

router.put(
  '/reject/:id',
  isResourceAvailable,
  async (req: Request, res: Response) => {
    try {
      const resourceKey = `resource:${req.params.id}`;
      const resource = await prisma.resources.update({
        where: {
          id: req.params.id
        },
        data: {
          isApproved: false
        }
      });
      if (!resource) {
        res.status(404).json('error rejecting the resource');
      }
      await (await redisClient).del(resourceKey);
      await refreshApprovedTable();
      await refreshUnapprovedTable();
      res.status(200).json({
        ok: true,
        message: 'resource rejected successfully'
      });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json(error);
    }
  }
);

//* approve a resource

router.put(
  '/approve/:id',
  isResourceAvailable,
  async (req: Request, res: Response) => {
    try {
      const resourceKey = `resource:${req.params.id}`;
      const resource = await prisma.resources.update({
        where: {
          id: req.params.id
        },
        data: {
          isApproved: true
        }
      });
      if (!resource) {
        res.status(404).json('error approving the resource');
      }
      await (await redisClient).del(resourceKey);
      await refreshApprovedTable();
      await refreshUnapprovedTable();
      res.status(200).json({
        ok: true,
        message: 'resource approved successfully'
      });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json(error);
    }
  }
);

//* delete a resourcee

router.delete(
  '/:id',
  isResourceAvailable,
  async (req: Request, res: Response) => {
    try {
      const resourceKey =  `resource:${req.params.id}`
      const resource = await prisma.resources.delete({
        where: {
          id: req.params.id
        }
      });
      if(!resource)
         {res.status(404).json('error deleting the resource')}
         await(await redisClient).del(resourceKey);
         await refreshApprovedTable();
         await refreshUnapprovedTable();
        res.status(200).json({
            ok: true,
            message: 'resource deleted successfully'
          });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json(error);
    }
  }
);

export default router;

const fetchResourceTable = async (name: any, isApproved: any) => {
  const resources = await prisma.resources.findMany({
    where: {
      isApproved: isApproved
    }
  });
  const isInserted = await (
    await redisClient
  ).setEx(name, 86400, JSON.stringify(resources));
  !isInserted
    ? () => {
        console.log('====================================');
        console.log('cannot insert in the table');
        console.log('====================================');
      }
    : () => {
        console.log('====================================');
        console.log('inserted in the table');
        console.log('====================================');
      };
  return;
};

const deleteResourceTable = async (name: any) => {
  const isDeleted = await (await redisClient).del(name);
  !isDeleted
    ? () => {
        console.log('====================================');
        console.log('cannot delete the table');
        console.log('====================================');
      }
    : () => {
        console.log('====================================');
        console.log('deleted the table');
        console.log('====================================');
      };
  return;
};

const refreshApprovedTable = async () => {
  await fetchResourceTable(approvedKey, true);
  await deleteResourceTable(approvedKey);
  return ;
};

const refreshUnapprovedTable = async () => {
  await fetchResourceTable(unapprovedKey, false);
  await deleteResourceTable(unapprovedKey);
  return ;
};
