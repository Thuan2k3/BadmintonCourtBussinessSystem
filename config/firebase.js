const admin = require("firebase-admin");
const serviceAccount = require("./firebase-service-account.json"); // Đường dẫn tới file JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://badminton-court-bussiness-default-rtdb.firebaseio.com", // Thay bằng URL Firebase của bạn
});

const db = admin.database();
module.exports = db;
