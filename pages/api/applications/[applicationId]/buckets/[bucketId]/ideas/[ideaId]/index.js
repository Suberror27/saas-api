import { db } from '@/lib/firebaseAdmin';

export default async function deleteIdea(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({message: "Method not allowed"})
    } else {

        try {
            const applicationId = req.query.applicationId;
            const bucketId = req.query.bucketId;
            const ideaId = req.query.ideaId;

            if(!bucketId || !applicationId || !ideaId) {
                return res.status(400).json({error: "ApplicationId, BucketId, and IdeaId are required"})
            } else {
                const ideaRef = db.collection("Applications").doc(applicationId).collection("Buckets").doc(bucketId).collection("Ideas").doc(ideaId);

                const checkIdea = await ideaRef.get();

                // Validating the exisiting of the specified Idea under the specified Bucket
                if (!checkIdea.exists) {
                    return res.status(404).json({message: "Idea not found under the specified BucketId"})
                    
                } else {
                    const deleteIdea = await ideaRef.delete();

                    return res.status(200).json({message: "Idea successfully removed", ideaId: ideaRef.id});
                }                
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ error: 'Failed to delete Idea' });
        }
    }
}