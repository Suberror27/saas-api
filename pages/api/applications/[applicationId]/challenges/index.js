import { db } from "@/lib/firebaseAdmin";

export default async function postChallenge(req, res) {
    
    if (req.method !== "POST") {
        return res.status(405).json({message: "Method not allowed"})
    } else {
        const applicationId = req.query.applicationId;
        const { name, startTime, endTime, participants } = req.body;

        try {
            
            if (!name || !startTime || !participants) {
                return res.status(400).json({message: "Name, StartTime, EndTime, and Participants are required to create challenge."})
            } else {
                const docRef = db.collection("Applications").doc(applicationId).collection("Challenges").doc();

                await docRef.set({
                    name: name,
                    startTime: startTime,
                    endTime: endTime ? endTime : "1 day", // Setting default value to 1 day if not passed in req.body
                    participants: participants,
                });

                return res.status(200).json({ challengeId: docRef.id, name: name, startTime: startTime, endTime: endTime ? endTime : "1 day", participants: participants });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ error: 'Failed to create Challenge' });
        }
    }
}