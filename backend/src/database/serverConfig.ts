import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount = require('../../firebase-admin-sdk.json') as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://portal-obcana-orechov-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "portal-obcana-orechov.appspot.com",
});

const db = admin.database();
const bucket = admin.storage().bucket();

export {
  admin,
  db,
  bucket
};