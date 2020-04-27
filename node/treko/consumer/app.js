const nodemailer = require('nodemailer');

var amqp = require('amqplib/callback_api');

const transporter = nodemailer.createTransport({
    service: 'Outlook',
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    //ignoreTLS: true,
    //requireTLS: false,
    auth: {
        user: "luana-linares@hotmail.com",
        pass: "Nic@240603"
    },
    tls: { rejectUnauthorized: false }
});


amqp.connect('amqp://rabbitmq:5672', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var q = 'tasks';

        ch.assertQueue(q, { durable: true });
        ch.prefetch(1);
        console.log(" [*] Aguardando mensagens em %s. Para sair use: CTRL+C", q);
        ch.consume(q, function (msg) {

            var msgJSON = JSON.parse(msg.content.toString());
            console.log(msgJSON)
            const mailOptions = {
                from: 'luana-linares@hotmail.com',
                to: msgJSON.email,
                subject: 'E-mail enviado usando Node!',
                html: msgJSON.html
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(" [x] Enviando email => %s", msg.content.toString());
                }
            });

        }, { noAck: true });
    });
});




