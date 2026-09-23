import admin from 'firebase-admin';
import fs from 'fs';

// Read JSON manually
const serviceAccount = JSON.parse(
  fs.readFileSync(new URL('./hospitalmanagement-8392f-firebase-adminsdk-fbsvc-dead533ba6.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
