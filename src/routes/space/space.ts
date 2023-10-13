import { Router, Request, Response } from 'express';
import { prisma } from '../../utilities/db';
import { body } from 'express-validator';
import { handleErrors, isSpaceAvailable } from '../../utilities/middlewares';
import { redisClient } from '../../utilities/redis';

const router = Router();

//* create a twitter space

router.post(
  '/',
  body('name').isString(),
  body('link').isString(),
  body('image').isString(),
  body('start').isString(),
  body('end').isString(),
  body('date').isString(),
  handleErrors,
  async (req: Request, res: Response) => {
    try {
      const space = await prisma.space.create({
        data: {
          ...req.body
        }
      });
      !space
        ? res.status(404).json({
            ok: true,
            message: 'error creating twitter spaces'
          })
        : res.status(200).json(space);
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json(error);
    }
  }
);

//* get all the twitter spaces

router.get('/', async (_req: Request, res: Response) => {
  try {
    const cacheKey = `space`;
    const cacheData = await (await redisClient).get(cacheKey);
    let spaces;

    if (cacheData) {
      spaces = JSON.parse(cacheData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      spaces = await prisma.space.findMany();
      !spaces
        ? res.status(404).json({
            ok: true,
            message: 'error getting twitter spaces'
          })
        : await (
            await redisClient
          ).setEx(cacheKey, 86400, JSON.stringify(spaces));
      
    }
    res.status(200).json(spaces);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

//* get a particular twitter space

router.get('/:id', isSpaceAvailable, async (req: Request, res: Response) => {
  try {
    const cacheKey = `space_data:${req.params.id}`;
    let cacheData = await (await redisClient).get(cacheKey);
    let space;
    if (cacheData) {
      space = JSON.parse(cacheData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      space = await prisma.space.findUnique({
        where: {
          id: req.params.id
        }
      });
      !space
        ? res.status(404).json({
            ok: true,
            message: 'error getting this twitter space'
          })
        : await (
            await redisClient
          ).setEx(cacheKey, 86400, JSON.stringify(cacheData));
      console.log('====================================');
      console.log('from api');
      console.log('====================================');
    }
    res.status(200).json(space);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

//* update a twitter space

router.put('/:id', isSpaceAvailable, async (req: Request, res: Response) => {
  try {
    const cacheKey = `space_data:${req.params.id}`;
    const spaceKey = 'space';
    const space = await prisma.space.update({
      where: {
        id: req.params.id
      },
      data: {
        ...req.body
      },
      select: {
        name: true,
        link: true,
        image: true,
        start: true,
        end: true,
        date: true
      }
    });
    !space
      ? res.status(404).json({
          ok: true,
          message: 'error updating this twitter space'
        })
      : async () => {
          await (await redisClient).del(cacheKey);
          await (await redisClient).del(spaceKey);
        };
    res.status(200).json({
      ok: true,
      message: 'space data updated successfully'
    });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

//* delete a twitter space

router.delete('/:id', isSpaceAvailable, async (req: Request, res: Response) => {
  try {
    const cacheKey = `space_data:${req.params.id}`;
    const spaceKey = 'space';
    const space = await prisma.space.delete({
      where: {
        id: req.params.id
      }
    });
    !space
      ? res.status(404).json({
          ok: true,
          message: 'error deleting this twitter space'
        })
      : async () => {
          await (await redisClient).del(cacheKey);
          await (await redisClient).del(spaceKey);
        };
    res.status(200).json({
      ok: true,
      message: 'space data deleted successfully'
    });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

export default router;
