import redis from 'redis';
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.REDIS_URL

export const redisClient = redis
  .createClient(
    {
      url : url
    }
  )
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect();

export const checkRedisHealth = async (_req: any, res: any, next: any) => {
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
