import redis from 'redis';
import { prisma } from './db';

export const redisClient = redis
  .createClient()
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect();

export const checkRedisHealth = async (req: any, res: any, next: any) => {
  const response = await (await redisClient).ping();

  !response
    ? () => {
        console.log('====================================');
        console.log('redis is not responding');
        console.log('====================================');
        res.status(500).json({ error: 'Redis server is not responding' });
      }
    : () => {
        next();
        console.log('====================================');
        console.log('redis is working well');
        console.log('====================================');
      };
};
