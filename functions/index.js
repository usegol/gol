const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.deleteOldCompletedGoals = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const currentTime = new Date();
  const fifteenDaysAgo = new Date(currentTime - 15 * 24 * 60 * 60 * 1000);

  const completedGoalsQuery = db.collection('goals').where('completed', '==', true).where('completedAt', '<=', fifteenDaysAgo);
  const querySnapshot = await completedGoalsQuery.get();

  const batch = db.batch();
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log('Deleted old completed goals.');

  return null;
  });


exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: 'price_ID',
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: 'https://your-website.com/success',
    cancel_url: 'https://your-website.com/canceled',
  });

  return { id: session.id };
});

