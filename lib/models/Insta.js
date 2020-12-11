const pool = require('../utils/pool');

module.exports = class Insta {
  id;
  description;
  img;

  constructor(row) {
    this.id = row.id;
    this.description = row.description;
    this.img = row.img;
  }

  static async insert({ description, img, tags = [] }) {
    const { rows } = await pool.query(
      'INSERT INTO instas (description, img) VALUES ($1, $2) RETURNING *', [description, img]
    );

    await pool.query(
      `INSERT INTO instas_tags (insta_id, tag_id)
      SELECT ${rows[0].id}, id FROM tags WHERE tag = ANY($1::text[])`,
      [tags]
    );

    return new Insta(rows[0]);
  }

  
};
