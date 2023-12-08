const { validationResult } = require("express-validator");
const WalletBalance = require("../../Models/WalletBalance");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const sequelize = require("../../config/dbconfig");
const User = require("../../Models/Users");
const { Op, Sequelize } = require("sequelize");

const WalletBalanceController = () => {
    return {
        AmountRequest: async (req, res) => {
            try {
                // Checking validation errors, using express-validator
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const error = errors.array().map((x) => {
                        return {
                            field: x.param,
                            message: x.msg
                        };
                    })
                    return res.status(409).json({ error, success: false });
                }
                const Running_balance = await WalletBalance.findOne({
                    where: {
                        user_id: req.body.user_id
                    },
                    order: [["id", "DESC"]]
                })
                const NewBalance = Running_balance ? +Running_balance.dataValues.running_balance : 0
                //creating data object for insertion
                const data = {
                    user_id: req.body.user_id,
                    debit_credit: 1,
                    amount: req.body.amount,
                    running_balance: NewBalance + +req.body.amount,
                    comment: req.body.comment,
                }

                const balance = await WalletBalance.create(data);
                return res.status(200).json({ success: true, message: "Balance added Succesfully" });

            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
        ReadAmountrequest: async (req, res) => {
            try {
                const mydata = await WalletBalance.findAll({
                    where: {
                        id: sequelize.literal(`(id, user_id) IN (SELECT MAX(id), user_id FROM wallet_balances GROUP BY user_id)`),
                        deleted_at: null,
                    },
                    attributes: {
                        exclude: ["deleted_at"],
                    },
                    group: ['user_id'],
                })
                if (!mydata.length) return res.status(400).json({
                    success: false,
                    message: "No wallet data found!",
                });;
                //FINALLY, Sending data in response
                res.status(200).json({
                    success: true,
                    message: "Wallet data fetch succesfully",
                    data: mydata,
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
        ReadperticularuserTotalbid: async (req, res) => {
            try {
                const mydata = await WalletBalance.findAll({
                    where: {
                        id: sequelize.literal(`(id, user_id) IN (SELECT MAX(id), user_id FROM wallet_balances GROUP BY user_id)`),
                        deleted_at: null,
                        user_id: req.user.id
                    },
                    attributes: ["id", "user_id", "running_balance"],
                    group: ['user_id'],
                })
                if (!mydata.length) return res.status(400).json({
                    success: false,
                    message: "No wallet data found!",
                });;
                //FINALLY, Sending data in response
                res.status(200).json({
                    success: true,
                    message: "Wallet data fetch succesfully",
                    data: mydata,
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
        ReadTransaction: async (req, res) => {
            try {
                const mydata = await User.findAll({
                    where: {
                        deleted_at: null,
                        status: 1,
                        id: req.user.id
                    },
                    attributes: ["id", "name", "mobile_number"],
                    include: [
                        {
                            model: WalletBalance,
                            as: "balanceDetails",
                            attributes: ["id", "amount", "debit_credit", "created_at"],
                            required: false,
                        }
                    ],
                    order: [
                        [Sequelize.literal('`balanceDetails`.`id` DESC')]
                    ],
                })
                if (!mydata.length) return res.status(400).json({
                    success: false,
                    message: "No user data found!",
                });
                let alldata = []
                for (const x of mydata) {
                    if (x.dataValues.balanceDetails.length) {
                        for (const y of x.dataValues.balanceDetails) {
                            const isDebit = y.dataValues.debit_credit === 0;
                            const signedAmount = isDebit ? -y.dataValues.amount : y.dataValues.amount;
                            const inputDate = new Date(y.dataValues.created_at);
                            const year = inputDate.getFullYear();
                            const month = String(inputDate.getMonth() + 1).padStart(2, '0');
                            const day = String(inputDate.getDate()).padStart(2, '0');

                            const formattedDate = `${year}-${month}-${day}`;
                            const formattedTime = inputDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                            const data = {
                                // name: x.dataValues.name,
                                amount: isDebit ? `${signedAmount}` : `+${signedAmount}`,
                                debit_credit: y.dataValues.debit_credit,
                                time: formattedTime,
                                date: formattedDate
                            };
                            alldata.push(data)
                        }
                    }
                }

                //FINALLY, Sending data in response
                res.status(200).json({
                    success: true,
                    message: "User data fetch succesfully",
                    data: alldata,
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
    }
};

module.exports = WalletBalanceController