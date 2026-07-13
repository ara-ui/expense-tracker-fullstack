const { Cashfree } = require("cashfree-pg");

const Order = require("../model/Order");
const jwt = require("jsonwebtoken");

// Cashfree Configuration
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.SANDBOX;


function generateAccessToken(id, name, isPremiumUser) {

    return jwt.sign(
        {
            userId: id,
            name: name,
            isPremiumUser: isPremiumUser
        },
        process.env.JWT_SECRET
    );

}

// Create Order
exports.purchasePremium = async (req, res) => {

    try {

        // Create DB Order
        const order = await Order.create({

            status: "PENDING",

            UserId: req.user.id

        });

        const cashfreeOrderId = "ORDER_" + Date.now();

        const request = {

            order_id: cashfreeOrderId,

            order_amount: 500,

            order_currency: "INR",

            customer_details: {

                customer_id: req.user.id.toString(),

                customer_email: req.user.email,

                customer_phone: "9999999999"

            }

        };

        // Latest Cashfree SDK
        //const response = await Cashfree.PGCreateOrder(request);
        // Create Cashfree Order
        const response = await Cashfree.PGCreateOrder(
            "2022-09-01",
            request
        );

        order.orderId = response.data.order_id;

        await order.save();

        res.status(201).json({

            success: true,

            payment_session_id: response.data.payment_session_id,

            order_id: response.data.order_id

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Unable to create order"

        });

    }

};

// Success
exports.updateTransactionStatus = async (req, res) => {

    try {

        const order = await Order.findOne({
            where: {
                orderId: req.body.order_id
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order Not Found"
            });
        }

        // Verify payment with Cashfree
        //const payments = await Cashfree.PGOrderFetchPayments(req.body.order_id);

        const payments = await Cashfree.PGOrderFetchPayments(
    "2022-09-01",
    req.body.order_id
);

        if (payments.data && payments.data.length > 0) {

            order.status = "SUCCESSFUL";

            // Save Payment ID (optional but recommended)
            order.paymentId = payments.data[0].cf_payment_id;

            await order.save();

            await req.user.update({
            isPremiumUser: true
            });

            const token = generateAccessToken(
                req.user.id,
                req.user.name,
                true
            );

            return res.status(200).json({
                success: true,
                message: "Transaction Successful",
                token: token
            });
        }

        return res.status(400).json({
            success: false,
            message: "Payment Verification Failed"
        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });

    }

};

// Failed Transaction
exports.failedTransaction = async (req, res) => {

    try {

        const order = await Order.findOne({

            where: {

                orderId: req.body.order_id

            }

        });

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order Not Found"

            });

        }

        order.status = "FAILED";

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Transaction Failed"

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false

        });

    }

};