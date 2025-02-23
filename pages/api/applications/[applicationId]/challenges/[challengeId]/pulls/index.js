import { db } from "@/lib/firebaseAdmin";

export default async function postChallenge(req, res) {
    
    // Ensure that the request method is GET; otherwise, return a 405 (Method Not Allowed) error
    if (req.method !== "GET") {
        return res.status(405).json({message: "Method not allowed"})
    } else {

        // Extract the applicationId and challengeId from the query parameters
        const applicationId = req.query.applicationId;
        const challengeId = req.query.challengeId;

        try {
            
            // Create a reference to the Buckets subcollection within the specific applicationId
            const bucketsCollection = db
                .collection("Applications")
                .doc(applicationId)
                .collection("Buckets");
            
            // Get all bucket documents within the specified applicationId
            const bucketsSnapshot = await bucketsCollection.get();

            // If no buckets are found, return a 200 response indicating no buckets found
            if (bucketsSnapshot.empty) {
                return res.status(200).json({ message: "No buckets found." });
            }

            // Initialize an empty array to store the results
            let results = [];

            // Iterate over each bucket document in the snapshot
            for (const bucketDoc of bucketsSnapshot.docs) {

                 // Get the Ideas subcollection within each bucket
                const ideasCollection = bucketDoc.ref.collection("Ideas");
                const ideasSnapshot = await ideasCollection.get();

                // If ideas exist in the bucket, iterate over each idea document
                if (!ideasSnapshot.empty) {
                    for (const ideaDoc of ideasSnapshot.docs) {
                        const ideaData = ideaDoc.data();

                        // Check if the idea's metadata contains the specified challengeId
                        if (ideaData.metadata.challengeId === challengeId) {

                            // Add the matched idea's data to the results array
                            results.push({
                                bucketId: bucketDoc.id, // Include the bucketId
                                ideaId: ideaDoc.id, // Include the ideaId
                                data: ideaData, // Include the idea data
                            });
                        }
                    }
                }
            }

            // If results are found, return them as part of the response
            if (results.length > 0) {
                return res.status(200).json({ results });
            } else {

                // If no matching ideas are found, return a 200 response indicating no matches
                return res.status(200).json({ message: "No ideas with the specified challengeId found." });
            }
            
        } catch (error) {
            // Log any errors encountered during the process
            console.error("Error fetching data:", error);

            // Return a 500 (Internal Server Error) response if an error occurs
            return res.status(500).json({ error: "Failed to retrieve ideas for the challenge" });
        }
    }
}