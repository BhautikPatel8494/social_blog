import { renderFile } from 'ejs';
import { createTransport } from 'nodemailer';

const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'bhautik.tagline@gmail.com',
        pass: 'tagline@123'
    }
});

export const sendMail = (path: string, recipientEmail: string, objData) => {
    renderFile(path, objData, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: 'bhautik.tagline@gmail.com',
                to: recipientEmail,
                subject: 'Forgot Password Email Verification',
                html: data
            };
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    })
}