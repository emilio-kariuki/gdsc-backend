import redis from 'redis';

export const redisClient = redis
  .createClient(
    {
        password: 'rNdhYhbML0cRb1dlKyhKbYQvWnLPElLy',
    socket: {
        host: 'redis-15610.c89.us-east-1-3.ec2.cloud.redislabs.com',
        port: 15610
    }
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
