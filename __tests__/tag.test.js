const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Tag = require('../lib/models/Tag');

describe('tags routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new tag', async() => {
    const res = await request(app)
      .post('/api/v1/tags')
      .send({
        tag: 'PDX'
      });

    expect(res.body).toEqual({
      id: '1',
      tag: 'PDX'
    });
  });

  it('finds a tag by id', async() => {
    const tag = await Tag.insert({
      tag: '#lookatme'
    });

    const res = await request(app)
      .get(`/api/v1/tags/${tag.id}`);

    expect(res.body).toEqual({
      id: '1',
      tag: '#lookatme'
    });
  });

  it('finds all tags', async() => {
    const tags = await Promise.all([
      { tag: '#pdx' },
      { tag: '#dopelife' },
      { tag: '#studiotime' },
    ].map(tag => Tag.insert(tag)));

    const res = await request(app)
      .get('/api/v1/tags');

    expect(res.body).toEqual(expect.arrayContaining(tags));
    expect(res.body).toHaveLength(tags.length);
  });

  it('updates a tag by id', async() => {
    const tag = await Tag.insert({
      tag: '#pdxlifeforlife'
    });
    
    const res = await request(app)
      .put(`/api/v1/tags/${tag.id}`)
      .send({
        tag: '#PDX4LIFE'
      });

    expect(res.body).toEqual({
      id: '1',
      tag: '#PDX4LIFE'
    });
  });

  it('deletes a tag by id', async() => {
    const tag = await Tag.insert({
      tag: '#pdxlifeforlife'
    });
    
    const res = await request(app)
      .delete(`/api/v1/tags/${tag.id}`);

    expect(res.body).toEqual(tag);
  });
});
