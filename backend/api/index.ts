// import response from './modules/response';
// import accessDb from './modules/accessDb';

// exports.handler = async (event: any, context: any): Promise<void> => {
//   const now = new Date();
//   await accessDb.updateTime(String(now.getTime()));
//   context.succeed(response.createResponse(200, 'Completed successfully !!'));
// };

import express from 'express';
import dotenv from 'dotenv';
import uuid from 'uuid/v4';
import cache from 'memory-cache';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const LinePay = require('line-pay');

dotenv.config();
const app = express();

app.listen(8080, () => {
  console.log('server is listening');
});

app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render(`${__dirname}/index`);
});

const pay = new LinePay({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
  hostname: process.env.LINE_PAY_HOSTNAME,
  isSandbox: true,
});

app.use('/pay/reserve', (req, res) => {
  const { value } = req.query;

  const options = {
    productName: '投げ銭',
    amount: value,
    currency: 'JPY',
    orderId: uuid(),
    confirmUrl: process.env.LINE_PAY_CONFIRM_URL,
  };

  pay.reserve(options).then((response: any) => {
    const reservation = {
      productName: '投げ銭',
      amount: value,
      currency: 'JPY',
      orderId: uuid(),
      confirmUrl: process.env.LINE_PAY_CONFIRM_URL,
      transactionId: '',
    };
    reservation.transactionId = response.info.transactionId;

    console.log('Reservation was made. Detail is following.');
    console.log(reservation);

    // Save order information
    cache.put(reservation.transactionId, reservation);

    res.redirect(response.info.paymentUrl.web);
  });
});

app.use('/pay/confirm', (req, res) => {
  if (!req.query.transactionId) {
    throw new Error('Transaction Id not found.');
  }

  // Retrieve the reservation from database.
  const reservation = cache.get(req.query.transactionId);
  if (!reservation) {
    throw new Error('Reservation not found.');
  }

  console.log('Retrieved following reservation.');
  console.log(reservation);

  const confirmation = {
    transactionId: req.query.transactionId,
    amount: reservation.amount,
    currency: reservation.currency,
  };

  console.log('Going to confirm payment with following options.');
  console.log(confirmation);

  pay.confirm(confirmation).then(() => {
    res.send('決済が完了しました。');
  });
});
