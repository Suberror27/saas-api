import { db } from '@/lib/firebaseAdmin';
import { increment } from 'firebase/firestore';

export default async function postHandler(req, res) {
    // Making sure the method is always POST else return error message
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const dateStamp = new Date();
    const formattedDateStamp = dateStamp.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
   
    const applicationId = req.query.applicationId;
    const bucketId = req.query.bucketId;
    const {onlyUnpicked, userId, pickedAt } = req.body;
    
    try {
        if (!userId || !pickedAt) {
            return res.status(400).json({message: "Need all filters to query data"});
        } else {
            const bucketRef = db.collection("Applications").doc(applicationId).collection("Buckets").doc(bucketId).collection("Ideas");

            const bucket = await bucketRef.get();

            if (!bucket) {
                return res.status(404).json({ error: "Idea not found with the specified filters" });
            } else {
                const ideas = bucket.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                  }));
    
                let notPickedIdeas = [];
                let picketIdeas = [];
                let selectedRandomIdea = [];

                ideas.map(element => {
                    if (element.metadata.timesPicked == 0) notPickedIdeas.push(element);
                    if (element.metadata.timesPicked > 0) picketIdeas.push(element);
                })
                // console.log(formattedDateStamp);
                // console.log("Ideas not picked " + notPickedIdeas.length);
                // console.log("Ideas picked " + picketIdeas.length);
                if (onlyUnpicked == true) {
                    selectedRandomIdea = notPickedIdeas[Math.floor(Math.random() * notPickedIdeas.length)];
                    // console.log(selectedRandomIdea);
                } else {
                    selectedRandomIdea = ideas[Math.floor(Math.random() * ideas.length)];
                }

                const updatedData = {
                    ...selectedRandomIdea,
                    metadata: {
                        ...selectedRandomIdea.metadata,
                        timesPicked: selectedRandomIdea.metadata.timesPicked + 1,
                    }
                }
                
                delete updatedData.id; 
                // console.log(updatedData);
                const updateIdea = await bucketRef.doc(selectedRandomIdea.id).update(updatedData);
                
                return res.status(200).json({selectedRandomIdea});

            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Failed retrieve Ideas from bucket' });
    }
}

