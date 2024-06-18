/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alert';

let stripe;

if (window.Stripe) {
  stripe = Stripe(
    'pk_test_51PSbjm03gPWLY730YcL0pZLEpPG9itTOlsoPjcA4ZtAM59LTDIaJBThOFRPpi8pRxj8EXsQZqMg3w8kfguc7oA3e006cJWsG92'
  );
}

export const bookTour = async tourid => {
  try {
    // 1. get the session from the endpoint
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourid}`
    );
    console.log(session);

    // 2. create checkout form and charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('errro', err);
  }
};
