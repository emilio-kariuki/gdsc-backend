import { Request, Response, Router } from 'express';
import { prisma } from '../../utilities/db.js';
import { isUserAvailable } from '../../utilities/middlewares.js';
// import { firebase } from '../../utilities/firebase.js';
import {

  redisClient
} from '../../utilities/redis.js';

const router = Router();

//* get all the users

router.get('/', async (_req: Request, res: Response) => {
  try {
    const cacheKey = `users`;
    let users;
    const cacheData = await (await redisClient).get(cacheKey);
    if (cacheData) {
      users = JSON.parse(cacheData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          twitter: true
        }
      });
      !users
        ? res.status(404).json('error getting the uses')
        : await (
            await redisClient
          ).setEx(cacheKey, 86400, JSON.stringify(users));
      console.log('====================================');
      console.log('from api');
      console.log('====================================');
    }
    res.status(200).json(users);
  } catch (e) {
    console.log('====================================');
    console.log(e);
    console.log('====================================');
    res.status(500).json(e);
  }
});

//* get a single user

router.get('/:id', isUserAvailable, async (req: Request, res: Response) => {
  try {
    const cacheKey = `user_profile:${req.params.id}`;
    const cacheData = await (await redisClient).get(cacheKey);

    let data;

    if (cacheData) {
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
      data = JSON.parse(cacheData);
    } else {
      data = await prisma.user.findUnique({
        where: {
          id: req.params.id
        }
      });
      console.log('====================================');
      console.log('from api');
      console.log('====================================');
      await (await redisClient).setEx(cacheKey, 3000, JSON.stringify(data));
    }

    res.status(200).json(data);
  } catch (e) {
    console.log('====================================');
    console.log(e);
    console.log('====================================');
    res.status(500).json(e);
  }
});

router.delete('/:id', isUserAvailable, async (req: Request, res: Response) => {
  try {
    const cacheKey = `user_profile:${req.params.id}`;
     await prisma.user.delete({
      where: {
        id: req.params.id
      }
    });
    await (await redisClient).del(cacheKey);
    await deleteUserTable();
    await fetchUserTable();
    res.status(200).json({
      ok: true,
      message: 'user deleted successfully'
    });
  } catch (e) {
    console.log('====================================');
    console.log(e);
    console.log('====================================');
    res.status(500).json(e);
  }
});
router.put('/password', async (req: Request, res: Response) => {
  try {
    const cacheKey = `user_profile:${req.params.id}`;
    const user = await prisma.user.update({
      where: {
        email: req.body.email
      },
      data: {
        password: req.body.password
      }
    });
    await (await redisClient).del(cacheKey);

    !user
      ? res.status(404).json('error updating  the password')
      : res.status(200).json(user);
  } catch (e) {
    console.log('====================================');
    console.log(e);
    console.log('====================================');
    res.status(500).json(e);
  }
});

//* make a user a admin

router.put(
  '/enableAdmin/:id',
  isUserAvailable,
  async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.update({
        where: {
          id: req.params.id
        },
        data: {
          isAdmin: true
        }
      });
      !user
        ? res.status(404).json('error creating the admin')
        : async () => {
            await deleteUserTable();
            await fetchUserTable();
            res.status(200).json(user);
          };
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json(error);
    }
  }
);

//* disable a user a admin

router.put(
  '/disableAdmin/:id',
  isUserAvailable,
  async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.update({
        where: {
          id: req.params.id
        },
        data: {
          isAdmin: false
        }
      });
      !user
        ? res.status(404).json('error disabling the admin')
        : async () => {
            await deleteUserTable();
            await fetchUserTable();
            res.status(200).json(user);
          };
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json(error);
    }
  }
);

//* getting the leads

router.get('/leads', async (_req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany({
      where: {
        isAdmin: true
      }
    });
    !user
      ? res.status(404).json('error getting the admins')
      : res.status(200).json(user);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

router.put('/:id', isUserAvailable, async (req: Request, res: Response) => {
  try {
    const cacheKey = `user_profile:${req.params.id}`;
    const user = await prisma.user.update({
      where: {
        id: req.params.id
      },
      data: {
        ...req.body
      }
    });
    await (await redisClient).del(cacheKey);
    await deleteUserTable();
    await fetchUserTable();
    !user
      ? res.status(404).json('error updating the user')
      : res.status(200).json(user);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});


export default router;



export const deleteUserTable = async () => {
  const userKey = 'users';
  const isDeleted = await (await redisClient).del(userKey);
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
      }
      return ;
};

export const fetchUserTable = async (
  
) => {
  const userKey = 'users';
  const users = await prisma.user.findMany();
  const isInserted = await (
    await redisClient
  ).setEx(userKey, 3000, JSON.stringify(users));
  !isInserted
    ? () => {
        console.log('====================================');
        console.log('cannot insert in the table');
        console.log('====================================');
      }
    :() => {
        console.log('====================================');
        console.log('inserted in the table');
        console.log('====================================');
      }
      return 
};
