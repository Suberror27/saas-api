import { db } from '@/lib/firebaseAdmin';

export default async function getIdea(req, res, applicationId, bucketId) {
    
    try {
        if (!applicationId || !bucketId) {
            return res.status(400).json({message: "Need ApplicationId and BucketID to fetch data"});
        } else {
            const bucketRef = db.collection("Applications").doc(applicationId).collection("Buckets").doc(bucketId).collection("Ideas");

            const bucketIdeas = await bucketRef.get();

            if (!bucketIdeas) {
                return res.status(404).json({ error: "Ideas not found with the specified filters" });
            } else {
                const ideas = bucketIdeas.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                res.status(200).json({ideas});
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Failed to retreive Ideas from bucket' });
    }
}

