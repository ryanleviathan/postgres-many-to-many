const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Insta = require('../lib/models/Insta');
const Tag = require('../lib/models/Tag');

describe('postgres-many-to-many routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterEach(() => {
    return pool.end();
  });

  it('creates a new Insta via post', async() => {
    const res = await request(app)
      .post('/api/v1/instas')
      .send({
        description: 'Making food again because I need food to live. Why not eat dope food?',
        img: 'https://i2.wp.com/www.eatthis.com/wp-content/uploads/2020/02/asian-pork-meatballs.jpg?fit=1200%2C879&ssl=1'
      });

    expect(res.body).toEqual({
      id: '1',
      description: 'Making food again because I need food to live. Why not eat dope food?',
      img: 'https://i2.wp.com/www.eatthis.com/wp-content/uploads/2020/02/asian-pork-meatballs.jpg?fit=1200%2C879&ssl=1'
    });
  });
});
