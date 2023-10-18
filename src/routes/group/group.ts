import { Router, Request, Response } from 'express';
import { prisma } from '../../utilities/db.js';
import { body } from 'express-validator';
import { handleErrors, isGroupAvailable } from '../../utilities/middlewares.js';
import { redisClient } from '../../utilities/redis.js';

const router = Router();

const cacheKey = 'groups';

//* get all the groups

router.get('/', async (_req: Request, res: Response) => {
  try {
    const cacheData = await (await redisClient).get(cacheKey);
    let groups;
    if (cacheData) {
      groups = JSON.parse(cacheData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      groups = await prisma.groups.findMany();
      await fetchGroupTable();
      console.log('====================================');
      console.log('from api');
      console.log('====================================');
    }

    !groups
      ? res.status(404).json({
          ok: true,
          message: 'error getting groups'
        })
      : res.status(200).json(groups);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});
//* get group by id

router.get('/:id', isGroupAvailable, async (req: Request, res: Response) => {
  try {
    const groupKey = `group:${req.params.id}`;
    const cacheData = await (await redisClient).get(groupKey);
    let group;

    if (cacheData) {
      group = JSON.parse(cacheData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      group = await prisma.groups.findUnique({
        where: {
          id: req.params.id
        }
      });
      await (await redisClient).setEx(groupKey, 86400, JSON.stringify(group));
      console.log('====================================');
      console.log('from api');
      console.log('====================================');
    }

    !group
      ? res.status(404).json({
          ok: true,
          message: 'error getting groups'
        })
      : res.status(200).json(group);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

//* create a group

router.post(
  '/create/',
  body('name').isString(),
  body('link').isString(),
  body('image').isString(),
  handleErrors,
  async (req: Request, res: Response) => {
    try {
      const groups = await prisma.groups.create({
        data: {
          ...req.body
        }
      });
      if (!groups) {
        res.status(404).json({
          ok: true,
          message: 'error creating group'
        });
      }
      await refreshGroupTable();
      res.status(200).json({
        ok: true,
        message: 'group created successfully',
        data: groups
      });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json(error);
    }
  }
);

//* update a group

router.put('/update/:id', isGroupAvailable, async (req: Request, res: Response) => {
  try {
    const groupKey = `group:${req.params.id}`;

    const group = await prisma.groups.update({
      where: {
        id: req.params.id
      },
      data: {
        ...req.body
      },
      select: {
        name: true,
        link: true,
        image: true
      }
    });

    if (!group) {
      res.status(404).json({
        ok: true,
        message: 'error updating group'
      });
    }
    await (await redisClient).del(groupKey);
    await refreshGroupTable();
    res.status(200).json({
      ok: true,
      message: 'group updated successfully',
      data: group
    });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

//* delete a group

router.delete('/delete/:id', isGroupAvailable, async (req: Request, res: Response) => {
  try {
    const groupKey = `group:${req.params.id}`;
    const group = await prisma.groups.delete({
      where: {
        id: req.params.id
      }
    });

  if ( !group)
       {res.status(404).json({
          ok: true,
          message: 'error deleting group'
        })}
        await(await redisClient).del(groupKey);
        await refreshGroupTable()
        res.status(200).json({
          ok: true,
          message: 'group deleted successfully'
        }); 
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

export default router;

const deleteTable = async () => {
  const isDeleted = await (await redisClient).del(cacheKey);
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
};

const fetchGroupTable = async () => {
  const groups = await prisma.groups.findMany();
  const isInserted = await (
    await redisClient
  ).setEx(cacheKey, 86400, JSON.stringify(groups));
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
};

const refreshGroupTable = async () => {
  await deleteTable();
  await fetchGroupTable();
  return;
};
