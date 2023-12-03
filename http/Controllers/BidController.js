const { Op, Sequelize } = require("sequelize");
const Bid = require("../../Models/Bids")
const TimeSlot = require("../../Models/TimeSlot")

const BidController = () => {
  return {
    AddBidAmount: async (req, res) => {
      try {
        const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        // Add leading zeros if needed
        const formattedHours = hours < 10 ? '0' + hours : hours;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

        const currentTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

        const timeSlotdata = await TimeSlot.findOne({
          where: {
            start_time: { [Op.lte]: currentTime },
            end_time: { [Op.gt]: currentTime },
          },
          attributes: ["id", "start_time", "end_time"]
        })
        const data = {
          user_id: req.body.user_id,
          zodiac_id: req.body.zodiac_id,
          bid_amount: req.body.bid_amount,
          time_slot_id: timeSlotdata.dataValues.id,
          date: formattedDate,
        }
        const Bidenter = await Bid.create(data)
        res.status(200).json({
          success: true,
          message: 'Data stored successfully',
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Bad request', success: false });
      }
    },
    readBidAmount: async (req, res) => {
      try {
        const Bidwinnerdata = await Bid.findAll({
          where: {
            deleted_at: null
          },
          group: ["zodiac_id", "time_slot_id"],
          attributes: [
            'zodiac_id',
            'time_slot_id',
            [Sequelize.literal('SUM(bid_amount)'), 'total_bid_amount'],
          ],
          order: [[Sequelize.literal('total_bid_amount'), 'DESC']],
        })

        res.status(200).json({
          success: true,
          message: 'Winner data fetched succesfully',
          data: Bidwinnerdata
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Bad request', success: false });
      }
    },
  }
};

module.exports = BidController