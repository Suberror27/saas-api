// Import the Firestore database instance from the custom Firebase Admin module
import { db } from '@/lib/firebaseAdmin';

export default async function postHandler(req, res) {
    // Making sure the method is always POST else return error message
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Extracting name from the request body
    const {name} = req.body;

    // Making sure there is a name being passed in the request body, else return error 404 message
    if(!name) {
        res.status(400).json({error: "Application name is required"})
    } else {

        try {
            // Generating random ID for the new document
            const docRef = db.collection("Applications").doc();
            
            // Create a new document in the "Applications" collection
            const newApplicationRef = await docRef.set({
                name, // Setting the document's name field to the provided value
            });

            // Responding with the generated ID and application name
            return res.status(200).json({id: docRef.id, name, });

        } catch (error) {
            // Handling any errors that occuer during document creation
            console.error('Error creating application:', error);
            res.status(500).json({ error: 'Failed to create application' });
        }



        // ----------------------Simple code that creates a new document ID in Applications collection. Firestore creates the new random document ID and returns it along with the name------------------

        // try {
        //     const newApplicationRef = await db.collection("Applications").add({
        //         name
        //     })

        //     res.status(200).json({
        //         id: newApplicationRef.id,
        //         name
        //     })
        // } catch (error) {
        //     console.error('Error creating application:', error);
        //     res.status(500).json({ error: 'Failed to create application' });
        // }

        // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        // ------------------------------------This code just gets the name of the document inside of collection Applications---------------------------------------------------

        // try {
        //     const snapshot = await db.collection('Applications').get();
        //     const applications = snapshot.docs.map((doc) => ({
        //       id: doc.id,
        //       ...doc.data(),
        //     }));
        
        //     res.status(200).json(applications);
        //   } catch (error) {
        //     console.error('Error fetching Applications:', error);
        //     res.status(500).json({ error: 'Failed to fetch Applications' });
        //   }

        // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
    }
}
