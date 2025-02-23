import { initializeApp, getApps, cert } from 'firebase-admin/app'; // For app initialization and credential management
import { getFirestore } from 'firebase-admin/firestore'; // This function initializes and provides access to Cloud Firestore in a Firebase Admin environment

// Checking if Firebase Admin SDK is initialized
if (!getApps().length) {
  
  // Initializing Firebase Admin SDK with the service account credentials
  initializeApp({
    
    // Parsing the environment variable to retrieve the service account key and generate credentials
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
  });
}

// Get the Firestore database instance associated with the initialized Firebase app
const db = getFirestore();

// Export the Firestore database instance to be used in other parts of the application
export { db };
