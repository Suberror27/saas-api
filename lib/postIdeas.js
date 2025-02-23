import { db } from '@/lib/firebaseAdmin';

export default async function postIdea(req, res, applicationId, bucketId, text, metadata) {
    
    try {

        // Validate that createdBy and createdAt fields are provided
        if (!metadata.createdBy || !metadata.createdAt) {
            return res.status(400).json({message: "Need createdBy and createdAt data"});
        } else {

            // Reference to a new document inside the "Ideas" collection within the specified application and bucket
            const docRef = db
                .collection("Applications")
                .doc(applicationId)
                .collection("Buckets") 
                .doc(bucketId)
                .collection("Ideas") 
                .doc();

            // Create the new idea document with the provided text and metadata    
            const newIdea = await docRef.set({
                text, // Store the idea text
                metadata: {
                    ... metadata, // Include existing metadata values
                    timesPicked: 0, // Initialize timesPicked to 0
                    pickHistory: [], // Initialize pickHistory as an empty array
                }
            });
    
            // Return a successful response with the created idea details
            return res.status(200).json({
                ideaId: docRef.id, // Return the generated document ID
                text: text, // Return the idea text
                metadata: {
                    createdBy: metadata.createdBy, // Return createdBy field
                    createdAt: metadata.createdAt, // Return createdAt field
                    timesPicked: 0, // Return initialized timesPicked value
                    pickHistory: [], // Return initialized pickHistory array
                } 
            });
        }
    } catch (error) {
        // Log any errors that occur during the process
        console.error('Error fetching data:', error);

        // Send a 500 response if an internal server error occurs
        return res.status(500).json({ error: 'Failed to add Idea into Bucket' });
    }
}

