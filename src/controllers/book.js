// const { Book } = require('../models');
const getDb = require('../services/db');

exports.create = async (req, res) => {
  const db = await getDb()
  const { name, author } = req.body;

  try {
    await db.query(`INSERT INTO Book (name, author) VALUES ('${name}', '${author}')`);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'There was an error connecting to the database.'})
  }
  db.close();
}
