import { db } from '@/lib/firebaseAdmin';

export default async function getIdea(req, res, applicationId, bucketId) {
    
    try {
        // Check if both applicationId and bucketId are provided in the request
        if (!applicationId || !bucketId) { 
            return res.status(400).json({message: "Need ApplicationId and BucketID to fetch data"});
        } else {
            // Get a reference to the "Ideas" collection inside the specified application and bucket
            const bucketRef = db
                .collection("Applications")
                .doc(applicationId)
                .collection("Buckets")
                .doc(bucketId)
                .collection("Ideas");

            // Fetch all documents from the "Ideas" collection    
            const bucketIdeas = await bucketRef.get();

            // Check if any ideas were found
            if (!bucketIdeas) {
                return res.status(404).json({ error: "Ideas not found with the specified filters" });
            } else {

                // Convert Firestore documents into an array of idea objects
                const ideas = bucketIdeas.docs.map(doc => ({
                    id: doc.id, // Include the document ID
                    ...doc.data() // Spread the rest of the document data
                }));

                // Send the ideas as a JSON response
                return res.status(200).json({ideas});
            }
        }
    } catch (error) {
        // Log any errors that occur during the process
        console.error('Error fetching data:', error);

        // Send a 500 response if an internal error occurs
        return res.status(500).json({ error: 'Failed to retreive Ideas from bucket' });
    }
}

