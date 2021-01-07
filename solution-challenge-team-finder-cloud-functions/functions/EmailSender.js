const nodemailer = require('nodemailer');
const config = require("./config");

class EmailSender {
    
    constructor(logger) {
        this.logger = logger;

        // Create transporter
        this.emailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { // replace with your credentials
                user: config.EMAIL_SENDER_USERNAME, // email
                pass: config.EMAIL_SENDER_PASSWORD // password
            }
        });

        this.newlineRegularExpression = /\r?\n|\r/g;
    }
    /**
     *
     * @param config - {email, subject, body}
     * @returns {Promise<string>}
     */
    async sendEmail(config) {
        let {email, subject, body} = config;

        if (!email) {
            throw new Error("Error: No email provided");
        }

        // format body
        body = body.replace(this.newlineRegularExpression, "<br>");

        // Create email payload
        const emailOptions = {
            from: "Solution Challenge Team Finder <solutionchallengeteamfinder@gmail.com>",
            to: email,
            subject: subject,
            html: `<p>${body}</p>`
        };

        // Send email

        try {
            await this.emailTransporter.sendMail(emailOptions, (err, info) => {
                if (err) {
                    this.logger.log("Error sending email: ", err);
                    throw new Error(err);
                }
            })
        } catch (err) {
            this.logger.log("Error sending email: ", err);
            throw new Error(err)
        }

        this.logger.log("Sent an email to " + email);
    }
}

module.exports = EmailSender;