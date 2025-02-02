import React from 'react';
import logo from './logo.png';
import './App.css';
import axios from 'axios';

function Pay() {
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const result = await axios.post('http://localhost:3500/api/payment/orders');

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: 'rzp_test_FIzbNAnJGoToSn', // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: 'BusMate',
      description: 'Ticket',
      image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post('http://localhost:3500/api/payment/success', data);

        alert(result.data.msg);
      },
      prefill: {
        name: 'BusMate',
        email: 'info@busmate.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Kottayam,Kerala',
      },
      theme: {
        color: '#61dafb',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className='App'>
      <header className='App-header'>
        {/* <img src={logo} className='App-logo' alt='logo' /> */}
        <p>Buy Ticket Now</p>
        <button className='App-link' onClick={displayRazorpay}>
          Pay ₹ 500
        </button>
      </header>
    </div>
  );
}

export default Pay;
