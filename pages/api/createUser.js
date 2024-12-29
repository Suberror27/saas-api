// import db from '@/lib/firebase';
import { db } from '@/lib/firebaseAdmin';

// Custom code to auto increment newly created Applications document ID's to keep a consistent pattern, starting with app001 
const getNextId = async () => {
    const snapshot = await db.collection('Applications')
      .orderBy('name', 'desc') // Order by name (or any other field) to get the last document
      .limit(1) // Only get the last document
      .get(); // Retrive the id
  
    if (snapshot.empty) {
      return 'app001'; // If no documents, start with app001
    }

    const lastDoc = snapshot.docs[0];
    const lastId = lastDoc.id;
  
    // Assuming the ID pattern is 'app' followed by a number
    const lastNumber = parseInt(lastId.replace('app', ''), 10);
    const nextNumber = lastNumber + 1;
    const nextId = `app${nextNumber.toString().padStart(3, '0')}`; // Pads the number to always be 3 digits
    // console.log(nextId);
    return nextId;
};

export default async function getHandler(req, res) {
    // Making sure the method is always POST else return error message
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Extract name from the request body
    const { name } = req.body;

    // Making sure there is a name being passed in the request body, else return error message
    if(!name) {
        res.status(400).json({error: "Application name is required"})
    } else {

        try {
            const nextId = await getNextId(); // Generate the next ID
            
            // Create a new document with the custom ID
            const newApplicationRef = await db.collection('Applications').doc(nextId).set({
                name,
            });

            res.status(200).json({
                id: nextId, // Return the generated custom ID
                name, // Return the application name
            });
        } catch (error) {
            console.error('Error creating application:', error);
            res.status(500).json({ error: 'Failed to create application' });
        }
    }
}
