const pool = require('../utils/pool');

module.exports = class Tag {
  id;
  tag;

  constructor(row) {
    this.id = row.id;
    this.tag = row.tag;
  }

  static async insert({ tag }) {
    const { rows } = await pool.query(
      'INSERT INTO tags (tag) VALUES ($1) RETURNING *', [tag]
    );

    return new Tag(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM tags 
      WHERE id=$1`, [id]
    );

    if(!rows[0]) throw new Error(`No tag with id ${id}`);
    return new Tag(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM tags'
    );

    return rows.map(row => new Tag(row));
  }

  static async update(id, { tag }) {
    const { rows } = await pool.query(
      'UPDATE tags SET tag=$1 WHERE id=$2 RETURNING *', [tag, id]
    );

    if(!rows[0]) throw new Error(`No tag with id ${id}`);
    return new Tag(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM tags WHERE id=$1 RETURNING *', [id]
    );

    if(!rows[0]) throw new Error(`No tag with id ${id}`);
    return new Tag(rows[0]);
  }
};
