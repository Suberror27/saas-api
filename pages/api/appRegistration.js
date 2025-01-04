// Import the Firestore database instance from the custom Firebase Admin module
import { db } from '@/lib/firebaseAdmin';

// Custom code to auto increment newly created applications document ID's to keep a consistent pattern, starting with app001 
const getNextId = async () => {

    // Here we are retrieving the last created document in the "Applications" collection
    const snapshot = await db.collection('Applications')
      .orderBy('name', 'desc') // Here we are ordering by name in descending order
      .limit(1) // Only get the last document
      .get(); // Execute the query to get the snapshot
  
    // Check if the collection is empty (no document exist)      
    if (snapshot.empty) {
      return 'app001'; // If no documents, start with app001
    }

    // Extract the last document from the snapshot
    const lastDoc = snapshot.docs[0];
    const lastId = lastDoc.id; // Get the document ID of the last document
    console.log("Last app ID is: " + lastId);
  
    // Here we are parsing the numeric part of the last ID (Exapmle: from "app001" extract "002")
    const lastNumber = parseInt(lastId.replace('app', ''), 10);
    const nextNumber = lastNumber + 1; // Incrementing the number by 1 to get the next ID
    const nextId = `app${nextNumber.toString().padStart(3, '0')}`; // Formating the number with leading zeros to make it 3 digits
    // console.log(nextId);

    return nextId; // Return the generated custom ID
};

export default async function getHandler(req, res) {
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
            // Generating the next custom ID for the new document
            const nextId = await getNextId();
            
            // Create a new document in the "Applications" collection
            const newApplicationRef = await db.collection('Applications').doc(nextId).set({
                name, // Setting the document's name field to the provided value
            });

            // Responding with the generated ID and application name
            res.status(200).json({id: nextId, name, });

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
