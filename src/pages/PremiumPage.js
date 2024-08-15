import React from 'react';
import { loadStripe } from "@stripe/stripe-js"

let frend_api_url = "https://d2141ekkpgdi0u.cloudfront.net";
const stripe_public_key = process.env.REACT_APP_IS_PROD === 'true' ? process.env.REACT_APP_STRIPE_LIVE_PUBLIC_KEY : process.env.REACT_APP_STRIPE_TEST_PUBLIC_KEY;

const getPlans = async () => {
  const plan = await fetch(frend_api_url+'/frend-get-stripe-pricings', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
  .then((response) => response.json())
  .then(async ({price_plans}) =>price_plans);

  return {
    "monthly": plan[1],
    "yearly": plan[0]
  }
}
const plans = await getPlans();

function SubscriptionPage() {
  async function onCheckout(e) {
    e.target.disabled = true
    const interval = e.target.id;
    const { session, membership_id } = JSON.parse(localStorage.getItem("cookie"))
    if (!session) {
      console.error("ERROR: No user session.")
      return;
    }

    const payload = {
      "priceId": plans[interval].id, 
      "success_url": "https://timely.frend.ai/purchase-success", 
      "cancel_url": "https://timely.frend.ai/",
      "userId": session.user.id,
      "email": session.user.email,
      "membershipId" : membership_id
    }

    await fetch(frend_api_url+'/frend-get-stripe-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((response) => response.json())
    .then(async (session_id) => {
      const stripe = await loadStripe(stripe_public_key);
      await stripe.redirectToCheckout({sessionId: session_id})
    });
  }

  return (
    <div className="subscription-page flex flex-col items-center justify-center h-screen">

      <h2 className="text-2xl font-semibold mb-4">Choose your Plan, cancel anytime.</h2>

      <div className="subscription-options flex justify-center">

        <div className="option bg-gray-100 border border-gray-300 rounded-lg p-6 m-4 text-center w-100">
          <h3 className="text-xl font-semibold mb-2">{plans.monthly.name}</h3> 
          <h4><span className="text-xl font-semibold mb-2">${plans.monthly.price} </span><s>$25.99</s><span className="font-semibold mb-2">/ month</span> </h4>
          <p className="text-gray-600 mb-4">(50% off regular price of $25.99/month)</p>
          <p className="text-gray-600 mb-4">Monthly payment billed as ${plans.monthly.price}</p>

          <button id="monthly" className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded" onClick={onCheckout}>
            Select
          </button>
        </div>

        <div className="option bg-gray-100 border border-gray-300 rounded-lg p-6 m-4 text-center w-100">
          <h3 className="text-xl font-semibold mb-2">{plans.yearly.name}</h3> 
          <h4><span className="text-xl font-semibold mb-2">$5.99 </span><s>$25.99</s><span className="font-semibold mb-2">/ month</span> </h4>
          <p className="text-gray-600 mb-4">(75% off regular price of $25.99/month)</p>
          <p className="text-gray-600 mb-4">Annual payment billed as ${plans.yearly.price}</p>
          <button id="yearly" className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded" onClick={onCheckout}>
            Select
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
