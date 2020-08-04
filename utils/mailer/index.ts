"use strict";

import nodemailer from "nodemailer";
import { confirmationLinkEmail } from "../mjml";

// async..await is not allowed in global scope, must use a wrapper
export const mailer = async (email, mode, confirmationLink, projectName) => {
    let fallbackText = `Hello ${email},\n\nWe have received a ${mode} attempt,\nTo complete the ${mode} process, open this URL\n${confirmationLink}\n\nIf you didn't attempted to ${mode}, please ignore this email.`;

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    let output = {
        data: null,
        error: null,
    };

    // send mail with defined transport object
    await transporter
        .sendMail({
            from: `"${projectName} 👻" <noreply@demoauth.com>'`, // sender address
            to: email, // list of receivers
            subject: `confirm ${mode} request for ${projectName}`, // Subject line
            text: fallbackText, // plain text body
            html: confirmationLinkEmail(
                projectName,
                email,
                mode,
                confirmationLink
            ).html, // html body
        })
        .then((data) => {
            output.data = data;
        })
        .catch((error) => {
            console.log("mailer", error);
            output.error = error;
        });

    if (output.data) {
        console.log("Message sent: %s", output.data.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log(
            "Preview URL: %s",
            nodemailer.getTestMessageUrl(output.data)
        );
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    return output;
};
