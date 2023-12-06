const { Op, Sequelize } = require("sequelize");
const Bid = require("../../Models/Bids")
const TimeSlot = require("../../Models/TimeSlot");
const WinnerZodiac = require("../../Models/WinnerZodiac");
const WalletBalance = require("../../Models/WalletBalance");
const WinnerManually = require("../../Models/WinnerManually");
const Zodiac = require("../../Models/Zodiac");
const fs = require('fs');
const path = require('path');
const BidController = () => {
  return {
    AddBidAmount: async (req, res) => {
      try {
        const WalletBalanceData = await WalletBalance.findOne({
          where: {
            user_id: req.user.id
          },
          order: [["id", "DESC"]],
          attributes: ["running_balance"]
        })
        // if (!WalletBalanceData) {
        //   return res.status(400).json({
        //     success: false,
        //     message: 'Wallet balance is less than your bid amount',
        //   });
        // }
        if (!WalletBalanceData || WalletBalanceData.dataValues.running_balance < req.body.bid_amount) {
          return res.status(400).json({
            success: false,
            message: 'Wallet balance is less than your bid amount!',
          });
        }
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
          user_id: req.user.id,
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
    // readBidAmount: async (req, res) => {
    //   try {
    //     const currentDate = new Date();
    //     const year = currentDate.getFullYear();
    //     const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    //     const day = String(currentDate.getDate()).padStart(2, '0');

    //     const formattedDate = `${year}-${month}-${day}`;
    //     const Bidwinnerdata = await Bid.findAll({
    //       where: {
    //         deleted_at: null,
    //         date: formattedDate,
    //       },
    //       group: ["zodiac_id", "time_slot_id"],
    //       attributes: [
    //         'zodiac_id',
    //         'time_slot_id',
    //         [Sequelize.literal('SUM(bid_amount)'), 'total_bid_amount'],
    //       ],
    //       order: [[Sequelize.literal('total_bid_amount'), 'DESC']],
    //     })

    //     const groupedData = Bidwinnerdata.reduce((acc, record) => {
    //       const { time_slot_id } = record;
    //       if (!acc[time_slot_id]) {
    //         acc[time_slot_id] = [];
    //       }
    //       acc[time_slot_id].push(record);
    //       return acc;
    //     }, {});

    //     // Find the record with max total_bid_amount for each time_slot_id
    //     const resultData = Object.values(groupedData).map(records => {
    //       const maxRecord = records.reduce((max, record) => (
    //         parseFloat(record.total_bid_amount) > parseFloat(max.total_bid_amount) ? record : max
    //       ));
    //       return maxRecord;
    //     });

    //     res.status(200).json({
    //       success: true,
    //       message: 'Winner data fetched succesfully',
    //       data: resultData
    //     });
    //   } catch (error) {
    //     console.log(error);
    //     res.status(400).json({ message: 'Bad request', success: false });
    //   }
    // },
    bidCronscript: async (req, res) => {
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
        const Bidwinnerdata = await Bid.findAll({
          where: {
            deleted_at: null,
            date: formattedDate,
            time_slot_id: timeSlotdata.dataValues.id - 1
          },
          group: ["zodiac_id", "time_slot_id"],
          attributes: [
            'zodiac_id',
            'time_slot_id',
            [Sequelize.literal('SUM(bid_amount)'), 'total_bid_amount'],
            'date'
          ],
          order: [[Sequelize.literal('total_bid_amount'), 'DESC']],
          limit: 1
        })
        if (Bidwinnerdata.length) {
          const balance = await WinnerManually.findOne({
            where: {
              time_slot_id: Bidwinnerdata[0].dataValues.time_slot_id,
              date: Bidwinnerdata[0].dataValues.date,
              deleted_at: null
            },
            attributes: ["zodiac_id", "time_slot_id", "id"]
          });
          data = {
            time_slot_id: Bidwinnerdata[0].dataValues.time_slot_id,
            zodiac_id: balance ? balance.dataValues.zodiac_id : Bidwinnerdata[0].dataValues.zodiac_id,
            date: Bidwinnerdata[0].dataValues.date,
          }
          const result = await WinnerZodiac.create(data)
          const Bidupdate = await Bid.findAll({
            where: {
              deleted_at: null,
              date: formattedDate,
              time_slot_id: timeSlotdata.dataValues.id - 1,
              zodiac_id: result.dataValues.zodiac_id,
            },
            attributes: [
              'zodiac_id',
              'time_slot_id',
              [Sequelize.literal('bid_amount* 5'), 'multiplied_bid_amount'],
              'date',
              'user_id'
            ],
          })

          for (const x of Bidupdate) {
            const Running_balance = await WalletBalance.findOne({
              where: {
                user_id: x.dataValues.user_id
              },
              order: [["id", "DESC"]]
            })
            const NewBalance = Running_balance ? +Running_balance.dataValues.running_balance : 0
            //creating data object for insertion
            const data = {
              user_id: x.dataValues.user_id,
              debit_credit: 1,
              amount: x.dataValues.multiplied_bid_amount,
              running_balance: NewBalance + +x.dataValues.multiplied_bid_amount,
              comment: "Winning bid",
            }

            const balance = await WalletBalance.create(data);
          }
        }
        res.status(200).json({
          success: true,
          message: 'Winner data fetched succesfully',
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Bad request', success: false });
      }
    },
    createManuallyWinner: async (req, res) => {
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
        //creating data object for insertion
        const data = {
          zodiac_id: req.body.zodiac_id,
          time_slot_id: timeSlotdata.dataValues.id,
          date: formattedDate,
        }
        const checkwinnerdata = await WinnerManually.findOne({
          where: {
            time_slot_id: timeSlotdata.dataValues.id,
            date: formattedDate,
            deleted_at: null
          }
        });
        if (checkwinnerdata) {
          const winner = await WinnerManually.update(data, {
            where: {
              time_slot_id: timeSlotdata.dataValues.id,
              date: formattedDate,
              deleted_at: null
            }
          });
        } else {
          const winner = await WinnerManually.create(data);
        }
        return res.status(200).json({ success: true, message: "Manually winner create successfully" });

      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server error", });
      }
    },
    readperticularUserBidAmount: async (req, res) => {
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
        console.log(timeSlotdata.dataValues.id, "----id--time-slot");
        const Bidwinnerdata = await Zodiac.findAll({
          where: {
            deleted_at: null,
          },
          attributes: ["id", "image", "name",
            "status",
            "order"],
          // group: ["Biddetails.zodiac_id", "Biddetails.time_slot_id"],
          include: [
            {
              model: Bid,
              as: "Biddetails",
              where: {
                deleted_at: null,
                date: formattedDate,
                time_slot_id: timeSlotdata.dataValues.id,
                user_id: req.user.id,
              },
              attributes: [
                'zodiac_id',
                'time_slot_id',
                'bid_amount',
                // [Sequelize.literal('SUM(bid_amount)'), 'total_bid_amount'],
                'date'
              ],
              required: false,
            }
          ]
        })
        if (!Bidwinnerdata.length) {
          return res.status(400).json({
            success: false,
            message: 'No data found!',
          });
        }
        const baseDirectory = process.cwd();
        const imageBaseUrl = 'http://localhost:8000/images';

    for (const x of Bidwinnerdata) {
      const imagePath = path.join(baseDirectory, 'http', 'images', x.dataValues.image);

      if (fs.existsSync(imagePath)) {
        x.dataValues.image = `${imageBaseUrl}/${x.dataValues.image}`;
      }
          x.dataValues.bid_amount = 0
          if (x.dataValues.Biddetails.length) {
            x.dataValues.bid_amount = x.dataValues.Biddetails.reduce((acc, curr) => +acc + +curr.bid_amount, 0)
          }
          delete x.dataValues.Biddetails

        }
        res.status(200).json({
          success: true,
          message: 'Data fetched succesfully',
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