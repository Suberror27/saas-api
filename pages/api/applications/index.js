import { db } from '@/lib/firebaseAdmin';

export default async function postHandler(req, res) {

    // Ensure that the request method is POST; otherwise, return a 405 (Method Not Allowed) error
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Extract the "name" field from the request body
    const {name} = req.body;

    // Validate that a name is provided; otherwise, return a 400 (Bad Request) error
    if(!name) {
        res.status(400).json({error: "Application name is required"})
    } else {

        try {
            // Generate a unique document reference within the "Applications" collection
            const docRef = db.collection("Applications").doc();
            
            // Create a new document with the provided name inside the "Applications" collection
            const newApplicationRef = await docRef.set({
                name, // Assign the provided name to the document
            });

            // Respond with the newly created application's ID and name
            return res.status(200).json({id: docRef.id, name, });

        } catch (error) {
            // Log any errors that occur during document creation
            console.error('Error creating application:', error);

            // Return a 500 (Internal Server Error) response in case of failure
            res.status(500).json({ error: 'Failed to create application' });
        }
    }
}
