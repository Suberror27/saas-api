import { db } from '@/lib/firebaseAdmin';

export default async function postHandler(req, res) {

    // Ensure that only POST requests are allowed; return an error for other methods
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Extract the applicationId from the query parameters
    const applicationId = req.query.applicationId;

    // Extract user details from the request body
    const { userId, name, roles } = req.body;

    // Validate that all required fields are provided; return an error if any are missing
    if(!name || !roles || !userId || !applicationId) {
        return res.status(400).json({error: "Name, Roles, userId, and ApplicationId fields are required"})
    } else {
        try {

            // Reference the Users subcollection under the specified ApplicationId document
            const userRef = db
                .collection("Applications")
                .doc(applicationId)
                .collection("Users")
                .doc(userId);
            
            // Create the new user document
            await userRef.set({
                name,
                roles
            });

            // Return a success response with the newly created user details
            return res.status(200).json({
                success: true,
                message: "User created successfully",
                newUser: { name, roles, userId }
            });

        } catch (error) {

            // Log any errors that occur during the user creation process
            console.error('Error creating user:', error);

            // Return a 500 (Internal Server Error) response if the operation fails
            return res.status(500).json({ error: 'Failed to create New User' });
        }
    }
}

