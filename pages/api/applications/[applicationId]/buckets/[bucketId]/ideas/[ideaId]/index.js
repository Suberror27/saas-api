import { db } from '@/lib/firebaseAdmin';

export default async function deleteIdea(req, res) {

    // Ensure that the request method is DELETE; otherwise, return a 405 (Method Not Allowed) error
    if (req.method !== "DELETE") {
        return res.status(405).json({message: "Method not allowed"})
    } else {

        try {

            // Extract the applicationId, bucketId, and ideaId from the query parameters
            const applicationId = req.query.applicationId;
            const bucketId = req.query.bucketId;
            const ideaId = req.query.ideaId;

            // Validate that all required parameters are provided; otherwise, return a 400 (Bad Request) error
            if(!bucketId || !applicationId || !ideaId) {
                return res.status(400).json({error: "ApplicationId, BucketId, and IdeaId are required"})
            } else {

                // Create a reference to the specific idea document within the specified bucket
                const ideaRef = db
                    .collection("Applications")
                    .doc(applicationId)
                    .collection("Buckets")
                    .doc(bucketId)
                    .collection("Ideas")
                    .doc(ideaId);

                // Check if the idea exists in the specified bucket
                const checkIdea = await ideaRef.get();

                // Return a 404 (Not Found) error if the idea does not exist
                if (!checkIdea.exists) {
                    return res.status(404).json({message: "Idea not found under the specified BucketId"})
                    
                } else {
                    // Delete the idea document from Firestore
                    const deleteIdea = await ideaRef.delete();

                    // Respond with a success message and the deleted idea's ID
                    return res.status(200).json({message: "Idea successfully removed", ideaId: ideaRef.id});
                }                
            }
        } catch (error) {
            // Log any errors that occur during the deletion process
            console.error('Error fetching data:', error);
            
            // Return a 500 (Internal Server Error) response in case of failure
            return res.status(500).json({ error: 'Failed to delete Idea' });
        }
    }
}