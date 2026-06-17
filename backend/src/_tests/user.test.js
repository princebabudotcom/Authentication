import request from 'supertest';
import app from '../app.js';

describe('Health API', () => {
  test('GET /health', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
