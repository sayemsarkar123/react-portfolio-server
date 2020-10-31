const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const log = console.log;
const PORT = 8080;
require('dotenv').config()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const auth = {
  auth: {
      api_key: process.env.API_KEY,
      domain: process.env.DOMAIN
  }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email, subject, text, cb) => {
  const mailOptions = {
      from: email,
      to: 'sayemsarkar123@gmail.com',
      subject,
      text
  };

  transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
          return cb(err, null);
      }
      return cb(null, data);
  });
}

app.post('/send-mail', (req, res) => {
  const { email, subject, message } = req.body;
  sendMail(email, subject, message, (err, data) => {
    if (err) {
      res.status(500).send(false);
    } else {
      res.send(true)
    }
  });
})

app.listen(process.env.PORT || PORT, () => log(`Server is starting on PORT ${PORT}`));
