import { prisma } from '../../utilities/db.js';
import { Router, Request, Response } from 'express';
import { CourierClient } from '@trycourier/courier';
import { body } from 'express-validator';
import { handleErrors, isEmailAvailable } from '../../utilities/middlewares.js';
import { redisClient } from '../../utilities/redis.js';
const router = Router();

router.post(
  '/login',
  body('email').isString(),
  body('password').isString(),
  handleErrors,
  isEmailAvailable,
  async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: req.body.email
        },
        select: {
          password: true
        }
      });
      if (!user) {
        res.status(404).json({
          ok: true,
          message: 'user not found'
        });
      }

      const isValid = user?.password === req.body.password;
      !isValid
        ? res.status(404).json({
            ok: true,
            message: 'invalid credentials'
          })
        : res.status(200).json({
            ok: true,
            message: 'user logged in successfully'
          });
    } catch (error) {
      console.log('====================================');
      console.log(error);
    }
  }
);

router.post(
  '/register',
  body('name').isString(),
  body('email').isString(),
  body('password').isString(),
  handleErrors,
  isEmailAvailable,
  async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          name: req.body.name,
          password: req.body.password
        },
        select: {
          id: true,
          email: true
        }
      });

      if (!user) {
        res.status(404).json({
          ok: false,
          message: 'Error creating user'
        });
      }
      await sendEmail(req.body.email);
      const cacheKey = `users`;
      await (await redisClient).del(cacheKey);
      res.status(200).json({
        ok: true,
        message: 'user created successfully',
        data: {
          id: user.id,
          email: user.email
        }
      });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }
);

export default router;

async function sendEmail(email: any) {
  try {
    const courier = CourierClient({
      authorizationToken: 'pk_prod_GRZYXQV9SP46X4KTDBZ1MPBW6BP7'
    });

    await courier.send({
      message: {
        to: {
          email: email
        },
        template: 'R6EMCTVTB841AGQQ8J8BTA047KEA',
        data: {
          variables: 'awesomeness'
        }
      }
    });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
  }
}
