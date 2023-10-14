import { Router, Request, Response } from 'express';
import { prisma } from '../../utilities/db.js';
import { body } from 'express-validator';
import { handleErrors, isEventAvailable } from '../../utilities/middlewares.js';
import { redisClient } from '../../utilities/redis.js';

const router = Router();
const upcomingKey = 'upcoming';
const pastKey = 'past';

//* get all the upcoming  events

router.get('/upcoming', async (_req: Request, res: Response) => {
  try {
    const cachedData = await (await redisClient).get(upcomingKey);
    let events;

    if (cachedData) {
      events = JSON.parse(cachedData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      events = await prisma.event.findMany({
        where: {
          isCompleted: false
        }
      });
      await (
        await redisClient
      ).setEx(upcomingKey, 86400, JSON.stringify(events));
      console.log('====================================');
      console.log('from api');
      console.log('====================================');
    }

    !events
      ? res.status(404).json({
          ok: true,
          message: 'could not find the events'
        })
      : res.status(200).json(events);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json({ message: error });
  }
});

//* get all the past  events

router.get('/past', async (_req: Request, res: Response) => {
  try {
    const cachedData = await (await redisClient).get(pastKey);
    let events;

    if (cachedData) {
      events = JSON.parse(cachedData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      events = await prisma.event.findMany({
        where: {
          isCompleted: true
        }
      });
      await (await redisClient).setEx(pastKey, 86400, JSON.stringify(events));
      console.log('====================================');
      console.log('from api');
      console.log('====================================');
    }
    !events
      ? res.status(404).json({
          ok: true,
          message: 'could not find the events'
        })
      : res.status(200).json(events);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json({ message: error });
  }
});

//* get one event

router.get('/:id', isEventAvailable, async (req: Request, res: Response) => {
  try {
    const cacheKey = `event:${req.params.id}`;
    const cacheData = await (await redisClient).get(cacheKey);
    let event;

    if (cacheData) {
      event = JSON.parse(cacheData);
      console.log('====================================');
      console.log('from cache');
      console.log('====================================');
    } else {
      event = await prisma.event.findUnique({
        where: {
          id: req.params.id
        }
      });
      await (await redisClient).setEx(cacheKey, 86400, JSON.stringify(event));
      console.log('====================================');
      console.log('from api');
      console.log('====================================');
    }
    !event
      ? res.status(404).json({
          ok: true,
          message: 'could not get the event'
        })
      : res.status(200).json(event);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json({ message: error });
  }
});

//* search an upcoming event

router.get('/search/upcoming/:query', async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findMany({
      where: {
        name: {
          contains: req.params.query,
          mode: 'insensitive'
        },
        isCompleted: false
      }
    });

    !event
      ? res.status(404).json({
          ok: true,
          message: 'could not find the event'
        })
      : res.status(200).json(event);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json({ message: error });
  }
});

//* search a past event

router.get('/search/past/:query', async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findMany({
      where: {
        name: {
          contains: req.params.query,
          mode: 'insensitive'
        },
        isCompleted: true
      }
    });

    !event
      ? res.status(404).json({
          ok: true,
          message: 'could not find the event'
        })
      : res.status(200).json(event);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json({ message: error });
  }
});

//* create an event

router.post(
  '/',
  body('name').isString(),
  body('description').isString(),
  body('venue').isString(),
  body('link').isString(),
  body('image').isString(),
  body('time').isString(),
  body('date').isString(),
  body('organizers').isString(),
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
          createdAt: true
        }
      });

      if (!event) {
        res.status(404).json({
          ok: true,
          message: 'could not create the user'
        });
      }

      await refreshTables();
      res.status(200).json({
        ok: true,
        message: 'event created successfully',
        data: event
      });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json({ message: error });
    }
  }
);

//* update an event

router.put('/:id', isEventAvailable, async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.update({
      where: {
        id: req.params.id
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
        createdAt: true
      }
    });

    if (!event) {
      res.status(404).json({
        ok: true,
        message: 'could not update the event'
      });
    }
    await refreshTables();
    res.status(200).json({
      ok: true,
      message: 'updated successfully',
      event: event
    });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json({ message: error });
  }
});

//* complete an event

router.put(
  '/complete/:id',
  isEventAvailable,
  async (req: Request, res: Response) => {
    try {
      const event = await prisma.event.update({
        where: {
          id: req.params.id
        },
        data: {
          isCompleted: true
        }
      });

      if (!event) {
        res.status(404).json({
          ok: true,
          message: 'could not complete the event'
        });
      }
      await refreshTables();
      res.status(200).json({
        ok: true,
        message: 'event completed successfully'
      });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json({ message: error });
    }
  }
);

//* start an event

router.put(
  '/start/:id',
  isEventAvailable,
  async (req: Request, res: Response) => {
    try {
      const event = await prisma.event.update({
        where: {
          id: req.params.id
        },
        data: {
          isCompleted: false
        }
      });

      if (!event) {
        res.status(404).json({
          ok: true,
          message: 'could not start the event'
        });
      }
      await refreshTables();
      res.status(200).json({
        ok: true,
        message: 'event started successfully'
      });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json({ message: error });
    }
  }
);

//* delete an event

router.delete('/:id', isEventAvailable, async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.delete({
      where: {
        id: req.params.id
      }
    });

    if (!event) {
      res.status(404).json({
        ok: true,
        message: 'could not delete the event'
      });
    }
    await refreshTables();
    res.status(200).json({
      ok: true,
      message: 'event delete successfully'
    });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json({ message: error });
  }
});

export default router;

const deleteEventTable = async (name: any) => {
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
};

const fetchEventTable = async (name: any, isCompleted: any) => {
  const evebts = await prisma.event.findMany({
    where: {
      isCompleted: isCompleted
    }
  });
  const isInserted = await (
    await redisClient
  ).setEx(name, 3000, JSON.stringify(evebts));
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

const refreshTables = async () => {
  await deleteEventTable(upcomingKey);
  await deleteEventTable(pastKey);
  await fetchEventTable(upcomingKey, false);
  await fetchEventTable(pastKey, true);
  return;
};
