import { db } from "@/lib/firebaseAdmin";

export default async function postChallenge(req, res) {
    
    if (req.method !== "GET") {
        return res.status(405).json({message: "Method not allowed"})
    } else {
        const applicationId = req.query.applicationId;
        const challengeId = req.query.challengeId;

        try {
            
            const bucketsCollection = db.collection("Applications").doc(applicationId).collection("Buckets");
            const bucketsSnapshot = await bucketsCollection.get();

            if (bucketsSnapshot.empty) {
                return res.status(200).json({ message: "No buckets found." });
            }

            let results = [];

            for (const bucketDoc of bucketsSnapshot.docs) {
                const ideasCollection = bucketDoc.ref.collection("Ideas");
                const ideasSnapshot = await ideasCollection.get();
                // console.log(ideasSnapshot);

                if (!ideasSnapshot.empty) {
                    for (const ideaDoc of ideasSnapshot.docs) {
                        const ideaData = ideaDoc.data();
                        // console.log(ideaData);

                        if (ideaData.metadata.challengeId === challengeId) {
                            results.push({
                                bucketId: bucketDoc.id,
                                ideaId: ideaDoc.id,
                                data: ideaData,
                            });
                        }
                    }
                }
            }

            if (results.length > 0) {
                return res.status(200).json({ results });
            } else {
                return res.status(200).json({ message: "No ideas with the specified challengeId found." });
            }
            
        } catch (error) {
            console.error("Error fetching data:", error);
            return res.status(500).json({ error: "Failed to create Challenge" });
        }
    }
}