import admin from "firebase-admin";
import  serviceAccount from "../server.json";

const firebaseConfig: admin.AppOptions = {
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://apt-rite-346310-default-rtdb.firebaseio.com"
};

export const firebase = admin.initializeApp(firebaseConfig);

