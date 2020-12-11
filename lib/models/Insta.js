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

  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT
        instas.*,
        array_agg(tags.tag) AS tags
      FROM
        instas_tags
      JOIN instas
      ON instas_tags.insta_id = instas.id
      JOIN tags
      ON instas_tags.tag_id = tags.id
      WHERE instas.id=$1
      GROUP BY instas.id`,
      [id]
    );

    if(!rows[0]) throw new Error(`No insta found with that id (${id})`);

    return {
      ...new Insta(rows[0]),
      tags: rows[0].tags
    };
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM instas'
    );
    
    return rows.map(row => new Insta(row));
  }

  static async update(id, { description, img }) {
    const { rows } = await pool.query(
      'UPDATE instas SET description=$1, img=$2 WHERE id=$3 RETURNING *',
      [description, img, id]
    );

    if(!rows[0]) throw new Error(`No insta found with that id (${id})`);
    return new Insta(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM instas WHERE id=$1 RETURNING *',
      [id]
    );

    return new Insta(rows[0]);
  }
};
