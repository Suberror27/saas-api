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

            if(!userRef.exists) {
                return res.status(400).json({error: "User not found under the provided applicationId"});
            } else {
                const userData = userRef.data();
                return res.status(200).json({ userData });
            }
           
        } catch (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ error: 'Failed to get users information' });
        }
    }
}

