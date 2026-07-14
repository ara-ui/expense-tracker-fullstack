const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

console.log(process.env.BREVO_API_KEY);
console.log("BREVO KEY:", process.env.BREVO_API_KEY);

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendMail = async (receiverEmail) => {

    await tranEmailApi.sendTransacEmail({

        sender: {
            email: "zurikara9@gmail.com",
            name: "Expense Tracker"
        },

        to: [
            {
                email: receiverEmail
            }
        ],

        subject: "Forgot Password",

        textContent: "This is a dummy email from Expense Tracker."

    });

};

module.exports = {
    sendMail
};