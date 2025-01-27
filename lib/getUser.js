import { db } from '@/lib/firebaseAdmin';

export default async function getUser(req, res, applicationId, userId) {
    // Making sure the method is always POST else return error message
    // if (req.method !== 'GET') {
    //     return res.status(405).json({ error: 'Method not allowed' });
    // }

    // const applicationId = req.query.applicationId;
    // const userId = req.query.userId;
   
    if(!userId || !applicationId) {
        return res.status(400).json({error: "userId and applicationId data is required"})
    } else {
        try {

            // Reference to the Users subcollection under the specific ApplicationId document
            const userRef = await db.collection("Applications").doc(applicationId).collection("Users").doc(userId).get();

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

