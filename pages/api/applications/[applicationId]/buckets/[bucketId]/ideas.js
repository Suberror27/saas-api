import postIdea from '@/lib/postIdeas';
import getIdea from '@/lib/getIdeas';

export default async function postHandler(req, res) {
    const applicationId = req.query.applicationId;
    const bucketId = req.query.bucketId;
    const {text, metadata} = req.body;

    if (req.method === "POST") {
        postIdea(req, res, applicationId, bucketId, text, metadata);

    } else if (req.method === "GET") {
        getIdea(req, res, applicationId, bucketId);
        
    } else {
        return res.status(400).json({message: "Method not allowed"});
    }

   
    
    // try {
    //     if (!metadata.createdBy || !metadata.createdAt) {
    //         return res.status(400).json({message: "Need createdBy and createdAt data"});
    //     } else {
    //         const docRef = db.collection("Applications").doc(applicationId).collection("Buckets").doc(bucketId).collection("Ideas").doc();

    //         const newIdea = await docRef.set({
    //             text,
    //             metadata: {
    //                 ... metadata, 
    //                 timesPicked: 0,
    //                 pickHistory: [],
    //             }
    //         });
    
    //         return res.status(200).json(
    //             {
    //                 ideaId: docRef.id, 
    //                 text: text, 
    //                 metadata: {
    //                     createdBy: metadata.createdBy, 
    //                     createdAt: metadata.createdAt, 
    //                     timesPicked: 0, 
    //                     pickHistory: [],
    //                 } 
    //             }
    //         )
    //     }
    // } catch (error) {
    //     console.error('Error fetching data:', error);
    //     return res.status(500).json({ error: 'Failed to add Idea into Bucket' });
    // }
}

