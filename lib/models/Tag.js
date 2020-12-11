const pool = require('../utils/pool');

module.exports = class Tag {
  id;
  tag;

  constructor(row) {
    this.id = row.id;
    this.tag = row.tag;
  }

  static async insert({ tag }) {
    const { rows } = pool.query(
      'INSERT INTO tags (tag) VALUES ($1) RETURNING *', [tag]
    );

    return new Tag(rows[0]);
  }
};
