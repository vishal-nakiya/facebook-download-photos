const { Op } = require("sequelize");
const Sequelize = require("./config/dbconfig");
const cronJob = require('node-cron');
const Bid = require("./Models/Bids");
const WinnerZodiac = require("./Models/WinnerZodiac");
const TimeSlot = require("./Models/TimeSlot");
const WalletBalance = require("./Models/WalletBalance");
const WinnerManually = require("./Models/WinnerManually");
const Zodiac = require("./Models/Zodiac");


const task1 = cronJob.schedule('*/5 * * * *', async () => {
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
        const Bidwinnerdatacheckdata = await Bid.findAll({
            where: {
                deleted_at: null,
                date: formattedDate,
                time_slot_id: timeSlotdata.dataValues.id - 1
            },
            attributes: [
                "id",
                'zodiac_id',
                'time_slot_id',
                'date'
            ],
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
            if (Bidwinnerdatacheckdata.length > 1) {
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
                        [Sequelize.literal('bid_amount* 10'), 'multiplied_bid_amount'],
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
                    const iswinflag = await Bid.update({ is_win: 1 }, {
                        where: {
                            date: formattedDate,
                            time_slot_id: timeSlotdata.dataValues.id - 1,
                            zodiac_id: result.dataValues.zodiac_id,
                            user_id: x.dataValues.user_id
                        }
                    })
                }
            } else {
                const balance = await WinnerManually.findOne({
                    where: {
                        time_slot_id: Bidwinnerdata[0].dataValues.time_slot_id,
                        date: Bidwinnerdata[0].dataValues.date,
                        deleted_at: null
                    },
                    attributes: ["zodiac_id", "time_slot_id", "id"]
                });
                const Bidwinnerdatacheckdata = await Bid.findAll({
                    where: {
                        deleted_at: null,
                        date: formattedDate,
                        time_slot_id: timeSlotdata.dataValues.id - 1
                    },
                    attributes: [
                        "id",
                        'zodiac_id',
                        'time_slot_id',
                        'date'
                    ],
                })
                const zodiacdata = await Zodiac.findAll({
                    where: {
                        deleted_at: null,
                        id: { [Op.ne]: Bidwinnerdatacheckdata[0].dataValues.zodiac_id }
                    },
                    attributes: ["id"]
                })
                const randomIndex = Math.floor(Math.random() * zodiacdata.length);
                data = {
                    time_slot_id: timeSlotdata.dataValues.id - 1,
                    zodiac_id: balance ? balance.dataValues.zodiac_id : zodiacdata[randomIndex].id,
                    date: formattedDate,
                }
                const result = await WinnerZodiac.create(data)
            }
        } else {
            const balance = await WinnerManually.findOne({
                where: {
                    time_slot_id: timeSlotdata.dataValues.id - 1,
                    date: formattedDate,
                    deleted_at: null
                },
                attributes: ["zodiac_id", "time_slot_id", "id"]
            });
            const zodiacdata = await Zodiac.findAll({
                where: {
                    deleted_at: null
                },
                attributes: ["id"]
            })
            const randomIndex = Math.floor(Math.random() * zodiacdata.length);
            data = {
                time_slot_id: timeSlotdata.dataValues.id - 1,
                zodiac_id: balance ? balance.dataValues.zodiac_id : zodiacdata[randomIndex].id,
                date: formattedDate,
            }
            const result = await WinnerZodiac.create(data)
        }

    } catch (error) {
        console.log('Something went wrong in Push Notification', error);
    }
});
task1.start()