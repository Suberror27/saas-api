import { db } from "@/lib/firebaseAdmin";

export default async function postChallenge(req, res) {
    
    // Ensure that the request method is POST; otherwise, return a 405 (Method Not Allowed) error
    if (req.method !== "POST") {
        return res.status(405).json({message: "Method not allowed"})
    } else {

        // Extract the applicationId from the query parameters and the challenge details from the request body
        const applicationId = req.query.applicationId;
        const { name, startTime, endTime, participants } = req.body;

        try {
            
            // Validate that required fields (name, startTime, and participants) are provided; otherwise, return a 400 (Bad Request) error
            if (!name || !startTime || !participants) {
                return res.status(400).json({message: "Name, StartTime, EndTime, and Participants are required to create challenge."})
            } else {

                // Generate a new document reference for the challenge in the "Challenges" subcollection under the specific applicationId
                const docRef = db
                    .collection("Applications")
                    .doc(applicationId)
                    .collection("Challenges")
                    .doc();

                // Create the new challenge document in Firestore with the provided details
                await docRef.set({
                    name: name,
                    startTime: startTime,
                    endTime: endTime ? endTime : "1 day", // Setting default value to 1 day if not passed in req.body
                    participants: participants,
                });

                // Respond with the created challenge's ID and details
                return res.status(200).json({
                    challengeId: docRef.id, // Return the newly created challenge's ID
                    name: name, // Return the challenge name
                    startTime: startTime, // Return the start time
                    endTime: endTime ? endTime : "1 day", // Return the end time, defaulting to "1 day"
                    participants: participants, // Return the list of participants
                });
            }
        } catch (error) {
            // Log any errors that occur during the challenge creation process
            console.error('Error fetching data:', error);

            // Return a 500 (Internal Server Error) response if the operation fails
            return res.status(500).json({ error: 'Failed to create Challenge' });
        }
    }
}