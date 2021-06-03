// const { Book } = require('../models');
const getDb = require('../services/db');

exports.create = async (req, res) => {
  const db = await getDb()
  const { name, author } = req.body;

  try {
    await db.query(`INSERT INTO Book (name, author) VALUES (?, ?)`, [name, author]);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'There was an error connecting to the database.'})
  }
  db.close();
};

exports.list = async (req, res) => {
  const db = await getDb();
  try {
    const [ books ] = await db.query('SELECT * FROM Book');
    res.status(200).json(books);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'There was an error connecting to the database.' });
  }
  db.close();
};

exports.findById = async (req, res) => {
  const db = await getDb();
  const { id } = req.params;
  try {
    const [[ book ]] = await db.query(`SELECT * FROM Book WHERE id = ?`, [id]);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: 'The book could not be found.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'There was an error connecting to the database.' });
  }
  db.close();
};

exports.update = async (req, res) => {
  const db = await getDb();
  const { id } = req.params;
  try {
    const [{ affectedRows }] = await db.query('UPDATE Book SET ? WHERE id = ?', [req.body, id]);
    if (affectedRows) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'The book could not be found.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'There was an error connecting to the database.' });
  }
  db.close();
};

exports.delete = async (req, res) => {
  const db = await getDb();
  const { id } = req.params;
  try {
    const [{ affectedRows }] = await db.query('DELETE FROM Book WHERE id = ?', [id]);
    if (affectedRows) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'The book could not be found.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'There was an error connecting to the database.' });
  }
  db.close();
};