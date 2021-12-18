const { Data } = require('../../models');
const { formatData } = require('../../utils/formatData');

const addData = async (req, res) => {
  try {
    // formatData(req.body.data);
    // console.log(req.body.data);
    const data = await Data.create(req.body.data);
    res.status(201).json({ data });
  } catch (error) {
    // console.error(error);
    res.status(401).json({ error });
  }
}

module.exports = addData;
