import { db } from '@/lib/firebaseAdmin';

export default async function updateUser(req, res, applicationId, userId, name, roles) {
   
    // Validate that both userId and applicationId are provided
    if(!userId || !applicationId) {
        return res.status(400).json({error: "userId and applicationId are a MUST, at least one: name or roles is required"})
    } else {

        // Ensure that at least one field (name or roles) is provided for an update
        if (!name && !roles) {
            return res.status(400).json({message: "At least name or roles needed to update users information"})
        } else {
            try {

                // Reference to the specific user document inside the "Users" collection located within the "Applications" collection
                const userRef = db
                    .collection("Applications")
                    .doc(applicationId)
                    .collection("Users")
                    .doc(userId);
    
                // Retrieve the user document from Firestore
                const userDoc = await userRef.get();
    
                // Check if the user document exists in Firestore
                if (!userDoc.exists) {
                    return res.status(404).json({ error: "User not found under the specified applicationId" });
                } else {
                    // Prepare an object to store updated fields
                    const updateInformation = {};

                    // Update the name field if provided; otherwise, keep the existing value
                    if (name !== undefined) {
                        updateInformation.name = name;
                    } else {
                        updateInformation.name = userDoc.data().name;
                    }

                    // Update the roles field if provided; otherwise, keep the existing value
                    if (roles !== undefined) {
                        updateInformation.roles = roles;
                    } else {
                        updateInformation.roles = userDoc.data().roles;
                    }
                    
                    // Update the user document with the modified information
                    await userRef.update(updateInformation);
    
                    // Return a successful response with the updated user information
                    return res.status(200).json({
                        updatedInfo: {
                            userId: userDoc.data().userId, // Return the existing userId
                            name: updateInformation.name, // Return updated or existing name
                            roles: roles ? roles : userDoc.data().roles // Return updated or existing roles
                        }
                    });
                }
            } catch (error) {
                 // Log any errors that occur during the update process
                console.error("Error updating user:", error);

                // Send a 500 response if an internal server error occurs
                return res.status(500).json({ error: 'Failed to patch users information' });
            }
        }
    }
}

