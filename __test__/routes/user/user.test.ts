import request from 'supertest';
import { app } from '../../../src/index';

describe('GET /user', async () => {
  test('It should respond with an array of users', async () => {
    const reponse = await request(app).get('/user');
    expect(reponse.status).toEqual(200);
  });
});
