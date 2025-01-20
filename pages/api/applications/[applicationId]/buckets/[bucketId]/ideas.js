import { db } from '@/lib/firebaseAdmin';

export default async function postHandler(req, res) {
    // Making sure the method is always POST else return error message
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const applicationId = req.query.applicationId;
    const bucketId = req.query.bucketId;
    const {text, metadata} = req.body;
    
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

