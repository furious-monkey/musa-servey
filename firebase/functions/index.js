const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();

exports.addUser = functions.https.onRequest(async (req, res) => {
  const original = req.query.data;
  const writeResult = await admin.firestore().collection('user').add({'email': original.email, 'password': original.password});
  // Send back a message that we've successfully written the message
  res.json({result: `User with ID: ${writeResult.id} added.`});
});