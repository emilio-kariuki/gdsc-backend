import { validationResult } from 'express-validator';
import { prisma } from './db.js';

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
        message: 'event exist\'s'
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
        message: 'group exist\'s'
      })
    : next();
};

export const isUserAvailable = async (req: any, res: any, next: any) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id
    }
  });

  !user
    ? res.status(400).json({
        ok: true,
        message: 'user does not exist\'s'
      })
    : next();
};

export const isAlreadyAdmin = async(req: any, res: any, next: any)=>{
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id,
      isAdmin: true
    },
  })

  !user
    ?next()
    : res.status(400).json({
      ok: true,
      message: 'user is already an admin'
    })
}

export const isRemovedAdmin = async(req: any, res: any, next: any)=>{
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.id,
      isAdmin: false
    },
  })

  !user
    ?next()
    : res.status(400).json({
      ok: true,
      message: 'user is already removed as admin'
    })
}

export const isEmailAvailable = async (req: any, res: any, next: any) => {
  const group = await prisma.user.findUnique({
    where: {
      id: req.body.email
    }
  });

  !group
    ? res.status(400).json({
        ok: true,
        message: 'user exist\'s'
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
        message: 'resource exist\'s'
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
        message: 'space exist\'s'
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
        message: 'report exist\'s'
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
        message: 'feedback exist\'s'
      })
    : next();
};

