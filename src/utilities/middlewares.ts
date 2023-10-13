import { validationResult } from 'express-validator';
import { prisma } from './db';
import { redisClient } from './redis';

export const handleErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    res.status(400).errors(errors.array());
  } else {
    next();
  }
};

export const isEventAvailable = async (req: any, res: any, next: any) => {
  const group = await prisma.event.findUnique({
    where: {
      id: req.params.id
    }
  });

  !group
    ? res.status(400).json({
        ok: true,
        message: 'event does not exist'
      })
    : next();
};

export const isGroupAvailable = async (req: any, res: any, next: any) => {
  const group = await prisma.groups.findUnique({
    where: {
      id: req.params.id
    }
  });

  !group
    ? res.status(400).json({
        ok: true,
        message: 'group does not exist'
      })
    : next();
};

export const isUserAvailable = async (req: any, res: any, next: any) => {
  const group = await prisma.user.findUnique({
    where: {
      id: req.params.id
    }
  });

  !group
    ? res.status(400).json({
        ok: true,
        message: 'user does not exist'
      })
    : next();
};

export const isResourceAvailable = async (req: any, res: any, next: any) => {
  const group = await prisma.resources.findUnique({
    where: {
      id: req.params.id
    }
  });

  !group
    ? res.status(400).json({
        ok: true,
        message: 'resource does not exist'
      })
    : next();
};

export const isSpaceAvailable = async (req: any, res: any, next: any) => {
  const group = await prisma.space.findUnique({
    where: {
      id: req.params.id
    }
  });

  !group
    ? res.status(400).json({
        ok: true,
        message: 'space does not exist'
      })
    : next();
};

export const isReportAvailable = async (req: any, res: any, next: any) => {
  const group = await prisma.report.findUnique({
    where: {
      id: req.params.id
    }
  });

  !group
    ? res.status(400).json({
        ok: true,
        message: 'report does not exist'
      })
    : next();
};

export const isFeedbackAvailable = async (req: any, res: any, next: any) => {
  const group = await prisma.feedback.findUnique({
    where: {
      id: req.params.id
    }
  });

  !group
    ? res.status(400).json({
        ok: true,
        message: 'feedback does not exist'
      })
    : next();
};

