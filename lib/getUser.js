import { db } from '@/lib/firebaseAdmin';

export default async function getUser(req, res, applicationId, userId) {
   
    // Validate that both userId and applicationId are provided
    if(!userId || !applicationId) {
        return res.status(400).json({error: "userId and applicationId data is required"})
    } else {
        try {

            // Reference to the specific user document inside the "Users" collection located within the "Applications" collection
            const userRef = await db
                .collection("Applications")
                .doc(applicationId)
                .collection("Users")
                .doc(userId)
                .get();

            // Check if the user document exists in Firestore
            if(!userRef.exists) {
                return res.status(400).json({error: "User not found under the provided applicationId"});
            } else {
                // Extract user data from the document
                const userData = userRef.data();

                // Send the user data as a JSON response
                return res.status(200).json({ userData });
            }
           
        } catch (error) {
            // Log any errors that occur during the request
            console.error('Error fetching data:', error);
            
            // Send a 500 response if an internal server error occurs
            return res.status(500).json({ error: 'Failed to get users information' });
        }
    }
}

