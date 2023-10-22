import redis from 'redis';

export const redisClient = redis
  .createClient(
    {
      url : "redis://default:38655a0591ff429eb66122f0361aa26c@us1-enough-sailfish-41406.upstash.io:41406"
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
