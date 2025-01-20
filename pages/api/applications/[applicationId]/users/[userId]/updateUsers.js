import { db } from '@/lib/firebaseAdmin';

export default async function patchHandler(req, res) {
    // Making sure the method is always POST else return error message
    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const applicationId = req.query.applicationId;
    const userId = req.query.userId;
    const {name, roles} = req.body;
   
    if(!userId || !applicationId) {
        return res.status(400).json({error: "userId and applicationId are a MUST, at least name or roles data is required"})
    } else {
        if (!name && !roles) {
            return res.status(404).json({message: "At least name or roles needed to update users information"})
        } else {
            try {

                // Reference to the Users subcollection under the specific ApplicationId document
                const userRef = db.collection("Applications").doc(applicationId).collection("Users").doc(userId);
    
                // Check if the user document exists
                const userDoc = await userRef.get();
    
                if (!userDoc.exists) {
                    return res.status(404).json({ error: "User not found under the specified applicationId" });
                } else {
                    const updateInformation = {};
                    if (name !== undefined) {
                        updateInformation.name = name;
                    } else {
                        updateInformation.name = userDoc.data().name;
                    }
                    if (roles !== undefined) {
                        updateInformation.roles = roles;
                    } else {
                        updateInformation.roles = userDoc.data().roles;
                    }
    
                    await userRef.update(updateInformation);
    
                    return res.status(200).json({ success: true, message: "User data updated succesfully", updatedInfo: {userId: userDoc.data().userId, name: updateInformation.name, roles: roles ? roles : userDoc.data().roles} });
                }
            } catch (error) {
                console.error("Error updating user:", error);
                return res.status(500).json({ error: 'Failed to patch users information' });
            }
        }
    }
}

