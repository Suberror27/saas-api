import { db } from '@/lib/firebaseAdmin';

export default async function postHandler(req, res) {
    // Making sure the method is always POST else return error message
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const applicationId = req.query.applicationId;
    const { userId, name, roles } = req.body;

    if(!name || !roles || !userId || !applicationId) {
        return res.status(400).json({error: "Name, Roles, userId, and ApplicationId fields are required"})
    } else {
        try {

            // Reference to the Users subcollection under the specific ApplicationId document
            const userRef = db.collection("Applications").doc(applicationId).collection("Users").doc(userId);
            
            // Create the new user document
            await userRef.set({
                name,
                roles
            });

            return res.status(200).json({ success: true, message: "User created successfully", newUser: {name: name, roles: roles, userId: userId} });
        } catch (error) {
            console.error('Error creating application:', error);
            return res.status(500).json({ error: 'Failed to create New User' });
        }
    }
}

