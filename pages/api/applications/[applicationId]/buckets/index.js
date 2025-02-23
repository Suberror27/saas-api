import { db } from '@/lib/firebaseAdmin';

export default async function postHandler(req, res) {
    // Ensure that the request method is POST; otherwise, return a 405 (Method Not Allowed) error
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Extract the applicationId from the query parameters
    const applicationId = req.query.applicationId;

    // Extract the name and description from the request body
    const {name, description} = req.body;
    
    try {
        // Validate that both name and description are provided; otherwise, return a 400 (Bad Request) error
        if(!name || !description) {
            res.status(400).json({error: "Name and Description needed to create new Bucket"});
        } else {

            // Generate a unique document reference within the "Buckets" subcollection under the specified application
            const docRef = db
                .collection("Applications")
                .doc(applicationId)
                .collection("Buckets") 
                .doc();
                
            // Create a new bucket document with the provided name and description
            const newBucketRef = await docRef.set({
                name, // Assign the provided name
                description // Assign the provided description 
            });

            // Respond with the newly created bucket's ID, name, and description
            return res.status(200).json({id: docRef.id, name, description });
        }
    } catch (error) {
        // Log any errors that occur during the document creation process
        console.error('Error fetching data:', error);

        // Return a 500 (Internal Server Error) response if the operation fails
        return res.status(500).json({ error: 'Failed to create new Bucket' });
    }
}

