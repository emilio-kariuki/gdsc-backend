import admin from "firebase-admin";

var serviceAccount = require("../../server.json");


export const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apt-rite-346310-default-rtdb.firebaseio.com"
  });