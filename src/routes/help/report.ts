import { Router, Request, Response } from 'express';
import { prisma } from '../../utilities/db.js';
import {
  handleErrors,
  isReportAvailable
} from '../../utilities/middlewares.js';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/create/',
  body('name').isString(),
  body('email').isString(),
  body('content').isString(),
  body('token').isString(),
  handleErrors,
  async (req: Request, res: Response) => {
    try {
      const report = await prisma.report.create({
        data: {
          ...req.body
        }
      });
      !report
        ? res.status(404).json('error adding the report')
        : res
            .status(200)
            .json({ ok: true, nessage: 'report added succesfully' });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json(error);
    }
  }
);

//* get all the report

router.get('/', async (_req: Request, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      select: {
        id: true,
        name: true
      }
    });
    !reports
      ? res.status(404).json('error getting the report')
      : res.status(200).json(reports);
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

//* update a report

router.put('/update/:id', isReportAvailable, async (req: Request, res: Response) => {
  try {
    const report = await prisma.report.update({
      where: {
        id: req.params.id
      },
      data: {
        ...req.body
      }
    });
    !report
      ? res.status(404).json('error deleting the report')
      : res
          .status(200)
          .json({ ok: true, nessage: 'report deleted succesfully' });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json(error);
  }
});

//* delete a report

router.delete(
  '/delete/:id',
  isReportAvailable,
  async (req: Request, res: Response) => {
    try {
      const report = await prisma.report.delete({
        where: {
          id: req.params.id
        }
      });
      !report
        ? res.status(404).json('error deleting the report')
        : res
            .status(200)
            .json({ ok: true, nessage: 'report deleted succesfully' });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.status(500).json(error);
    }
  }
);

export default router;
