import { db } from '@/lib/firebaseAdmin';

export default async function postIdea(req, res, applicationId, bucketId, text, metadata) {

    // const applicationId = applicationId;
    // const bucketId = bucketId;
    // const text = text;
    // const metadata = metadata;
    
    try {
        if (!metadata.createdBy || !metadata.createdAt) {
            return res.status(400).json({message: "Need createdBy and createdAt data"});
        } else {
            const docRef = db.collection("Applications").doc(applicationId).collection("Buckets").doc(bucketId).collection("Ideas").doc();

            const newIdea = await docRef.set({
                text,
                metadata: {
                    ... metadata, 
                    timesPicked: 0,
                    pickHistory: [],
                }
            });
    
            return res.status(200).json(
                {
                    ideaId: docRef.id, 
                    text: text, 
                    metadata: {
                        createdBy: metadata.createdBy, 
                        createdAt: metadata.createdAt, 
                        timesPicked: 0, 
                        pickHistory: [],
                    } 
                }
            )
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Failed to add Idea into Bucket' });
    }
}

