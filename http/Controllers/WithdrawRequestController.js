const User = require("../../Models/Users");
const WalletBalance = require("../../Models/WalletBalance");
const WithdrawRequest = require("../../Models/WithdrawRequest");
const { validationResult } = require("express-validator");


const WithdrawRequestController = () => {
    return {
        WithdrawRequest: async (req, res) => {
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

                const user_id = req.user.id;

                const walletBalance = await WalletBalance.findOne({
                    where: { user_id: user_id },
                    order: [["id", "DESC"]]
                });
        
                if (walletBalance.running_balance < req.body.request_amount) {
                    return res.status(409).json({ success: false, message: "Insufficient funds in the wallet" });
                }

                const data = {
                    user_id: user_id,
                    request_amount: req.body.request_amount,
                }

                const Request = await WithdrawRequest.create(data);

                return res.status(200).json({ success: true, message: "Withdraw request Created Succesfully" });

            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
        Readrequests: async (req, res) => {
            try {
                const mydata = await WithdrawRequest.findAll({
                    where: {
                        deleted_at: null,
                    },
                    attributes: {
                        include: ["id", "request_amount", "accept_decline"],
                        exclude: ["deleted_at"]
                    },
                    include: [
                        {
                            model: User,
                            as: "userDetails",
                            attributes: ["id", "name", "mobile_number", "email", "status"],
                        }
                    ]
                })
                if (!mydata.length) return res.status(400).json({
                    success: false,
                    message: "No request found!",
                });     
                
                // const modifiedData = mydata.map(item => ({
                //     id: item.id,
                //     request_amount: item.request_amount,
                //     accept_decline: item.accept_decline,
                //     ...item.userDetails?.toJSON(),
                // }));

                //FINALLY, Sending data in response
                res.status(200).json({
                    success: true,
                    message: "Request data fetch succesfully",
                    data: mydata,
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
        RequestsAccept: async (req, res) => {
            try {
                const WithdrawRequestData = await WithdrawRequest.findOne({
                    where: {
                        deleted_at: null,
                        id: req.body.withdraw_request_id
                    },
                })
                if (!WithdrawRequestData) return res.status(400).json({
                    success: false,
                    message: "No request data found!",
                });

                const walletdataget = await WalletBalance.findOne({
                    where: {
                        user_id: WithdrawRequestData.dataValues.user_id
                    },
                    order: [["id", "DESC"]]
                })
                if (!walletdataget) return res.status(400).json({
                    success: false,
                    message: "No wallet data found!",
                });
                
                if (walletdataget.running_balance < WithdrawRequestData.dataValues.request_amount) {
                    return res.status(409).json({ success: false, message: "Insufficient funds in the wallet" });
                }

                const data = {
                    user_id: WithdrawRequestData.dataValues.user_id,
                    debit_credit: 0,
                    amount: parseFloat(WithdrawRequestData.dataValues.request_amount),
                    running_balance: parseFloat(walletdataget.dataValues.running_balance) - parseFloat(WithdrawRequestData.dataValues.request_amount),
                    comment: "Withdraw"
                }
                const walletdatacreate = await WalletBalance.create(data);

                const updatewithdrawrequest = await WithdrawRequest.update({ accept_decline: 1 }, {
                    where: {
                        deleted_at: null,
                        id: req.body.withdraw_request_id
                    },
                })
                //FINALLY, Sending data in response
                res.status(200).json({
                    success: true,
                    message: "Request accepted",
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
        RequestsReject: async (req, res) => {
            try {
                const WithdrawRequestData = await WithdrawRequest.findOne({
                    where: {
                        deleted_at: null,
                        id: req.body.withdraw_request_id
                    },
                })
                if (!WithdrawRequestData) return res.status(400).json({
                    success: false,
                    message: "No request data found!",
                });

                const updatewithdrawrequest = await WithdrawRequest.update({ accept_decline: 0 }, {
                    where: {
                        deleted_at: null,
                        id: req.body.withdraw_request_id
                    },
                })
                //FINALLY, Sending data in response
                res.status(200).json({
                    success: true,
                    message: "Request reject",
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
        UserRequestLists: async (req, res) => {
            try {
                const mydata = await WithdrawRequest.findAll({
                    where: {
                        deleted_at: null,
                        user_id: req.user.id
                    },
                    attributes: {
                        include: ["id", "request_amount", "accept_decline"],
                        exclude: ["deleted_at"]
                    },
                })
                if (!mydata.length) return res.status(400).json({
                    success: false,
                    message: "No request found!",
                });     
                

                //FINALLY, Sending data in response
                res.status(200).json({
                    success: true,
                    message: "Request data fetch succesfully",
                    data: mydata,
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal Server error", });
            }
        },
    }
};

module.exports = WithdrawRequestController