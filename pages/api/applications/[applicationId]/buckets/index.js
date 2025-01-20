import { db } from '@/lib/firebaseAdmin';

export default async function postHandler(req, res) {
    // Making sure the method is always POST else return error message
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const applicationId = req.query.applicationId;
    const {name, description} = req.body;
    
    try {
        if(!name || !description) {
            res.status(400).json({error: "Name and Description needed to create new Bucket"});
        } else {
            // Generating random ID for the new document
            const docRef = db.collection("Applications").doc(applicationId).collection("Buckets").doc();
                
            // Create a new document in the "Applications" collection
            const newBucketRef = await docRef.set({
                name,
                description 
            });

            return res.status(200).json({id: docRef.id, name, description });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Failed to create new Bucket' });
    }
}

