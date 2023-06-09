import React from 'react'
import NavigationBar from '../Landing Page/NavigationBar'
import { CheckIcon } from '@heroicons/react/20/solid'
import  { useNavigate } from 'react-router-dom';
import { collection, addDoc} from 'firebase/firestore';
import { db } from '../Firebase';
import Stripe from 'stripe';

const tiers = [
  {
    name: 'Standard',
    id: 'tier-standard',
    onClick: Subscribe.initiateCheckout,
    priceMonthly: '$9.99',
    description: 'Enjoy all Basic features plus set up to 6 goals, and access more detailed insights and analytics for improved habit tracking and progress.',
    features: [
      'Includes all Basic features',
      'Up to 6 goals',
      'Advanced analytics'
    ],
    mostPopular: true,
  },
//   {
//     name: 'Premium',
//     id: 'tier-premium',
//     href: '#',
//     priceMonthly: '$14.99',
//     description: 'Access all Standard features, plus personalized coaching, advanced analytics, and integration with other apps for a holistic approach to habit development and goal achievement.',
//     features: [
//       'Includes all Standard features',
//       'Personalized Feedback from a Coach or Expert',
//       'Advanced Analytics',
//       'Coming Soon: Integration with other apps',
//     ],
//     mostPopular: false,
//   },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Subscribe() {
    const navigate = useNavigate();

    async function initiateCheckout(planId) {
        const docRef = await addDoc(collection(db, 'checkout_sessions'), {
            price: planId,
            success_url: window.location.origin,
            cancel_url: window.location.origin,
            mode: 'subscription',
            // customerId: // The Firestore customer doc ID,
        });
    
        // Wait for the CheckoutSession to get attached by the extension
        docRef.onSnapshot((snap) => {
            const { sessionId } = snap.data();
            if (sessionId) {
                // We have a session, let's redirect to Checkout
                const stripe = Stripe('your-publishable-key');
                stripe.redirectToCheckout({ sessionId });
            }
        });
    }
    

  return (
    <div className="bg-white py-24 sm:py-32">
      {/* <NavigationBar backgroundColor="white" /> */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">Pricing</h2>
          <div className='flex justify-center mt-4'>
            <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 bg-gray-200 text-gray-800 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                    Back to Dashboard
            </button>
        </div>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            In order to continue to create over 3 goals, please subscribe to a plan.
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        Discover accessible personal growth with our AI-powered habit tracker. Try our basic plan and see how it helps you achieve goals and build positive habits, all within your budget.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'lg:z-10 lg:rounded-b-none' : 'lg:mt-8',
                tierIdx === 0 ? 'lg:rounded-r-none' : '',
                tierIdx === tiers.length - 1 ? 'lg:rounded-l-none' : '',
                'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={classNames(
                      tier.mostPopular ? 'text-green-600' : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-green-600/10 py-1 px-2.5 text-xs font-semibold leading-5 text-green-600">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.priceMonthly}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-green-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                onClick={tier.onClick}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? 'bg-green-600 text-white shadow-sm hover:bg-green-500'
                    : 'text-green-600 ring-1 ring-inset ring-green-200 hover:ring-green-300',
                  'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                )}
              >
                Subscribe
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
