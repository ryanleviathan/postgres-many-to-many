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

  afterAll(() => {
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

  it('finds an Insta by id', async() => {
    await Promise.all([
      { tag: '#pdx' },
      { tag: '#dopelife' },
      { tag: '#studiotime' },
    ].map(tag => Tag.insert(tag)));

    const insta = await Insta.insert({
      description: 'Cause my lifes dope and I do dope shit',
      img: 'https://townsquare.media/site/812/files/2016/11/dave-chappelle-kanye-west.jpg?w=1200&h=0&zc=1&s=0&a=t&q=89',
      tags: ['#dopelife', '#studiotime']
    });

    const res = await request(app)
      .get(`/api/v1/instas/${insta.id}`);

    expect(res.body).toEqual({
      ...insta,
      tags: ['#dopelife', '#studiotime']
    });
  });

  it('finds all instas', async() => {
    const instas = await Promise.all([
      { description: 'look at my cool rock', img: 'mycoolrock.jpg' },
      { description: 'i ride bikes so im cool', img: 'myradbikeonabridge.jpeg' },
      { description: 'i still eat food, see?', img: 'myterriblelookingdinner.png' }
    ].map(insta => Insta.insert(insta)));

    const res = await request(app)
      .get('/api/v1/instas');

    expect(res.body).toEqual(expect.arrayContaining(instas));
    expect(res.body).toHaveLength(instas.length);
  });

  it('updates an insta', async() => {
    const insta = await Insta.insert({
      description: 'my dog is a dog',
      img: 'actuallyapicofmycat.jpg'
    });

    const res = await request(app)
      .put(`/api/v1/instas/${insta.id}`)
      .send({
        description: 'this is actually my cat. my bad',
        img: 'stillthesamepicofmycat.jpg'
      });

    expect(res.body).toEqual({
      id: insta.id,
      description: 'this is actually my cat. my bad',
      img: 'stillthesamepicofmycat.jpg'
    });
  });

  it('deletes an insta by id', async() => {
    const insta = await Insta.insert({
      description: 'My First Insta post!!!',
      img: 'averyboringpicturethatithoughtwascool.png'
    });

    const res = await request(app)
      .delete(`/api/v1/instas/${insta.id}`);

    expect(res.body).toEqual(insta);
  });
});
