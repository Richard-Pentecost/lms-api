const { Data } = require('../../models');
const { averageWaterIntake, actualFeedRate } = require('../../utils/formatData');

const addData = async (req, res) => {
  try {
    // formatData(req.body.data);
    // console.log(req.body.data);
    const previousData = await Data.fetchPreviousDataForCalculations(req.body.previousData);

    const averageWaterIntake = averageWaterIntake(meterReading, previousMeterReading, cows, days);
    const actualFeedRate = actualFeedRate();

    const data = await Data.create(req.body.data);
    res.status(201).json({ data });
  } catch (error) {
    // console.error(error);
    if (error.errors) {
      res.status(401).json({ error });
    } else {
      res.status(500).json({ error: 'There was an error connecting to the database' });
    }
  }
}

module.exports = addData;
