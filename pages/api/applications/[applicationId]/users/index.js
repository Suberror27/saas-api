import { db } from '@/lib/firebaseAdmin';

export default async function postHandler(req, res) {
    // Making sure the method is always POST else return error message
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const applicationId = req.query.applicationId;
    const { userId, name, roles } = req.body;

    if(!name || !roles || !userId || !applicationId) {
        return res.status(400).json({error: "Name, Roles, userId, and ApplicationId fields are required"})
    } else {
        try {

            // Reference to the Users subcollection under the specific ApplicationId document
            // const userRef = db.collection("Applications").doc(applicationId).collection("Users").doc();
            const userRef = db.collection("Applications").doc(applicationId).collection("Users").doc(userId);
            
            // Create the new user document
            await userRef.set({
                name,
                roles
            });

            return res.status(200).json({ success: true, message: "User created successfully", newUser: {name: name, roles: roles, userId: userId} });
        } catch (error) {
            console.error('Error creating application:', error);
            return res.status(500).json({ error: 'Failed to create New User' });
        }
    }
}

// Old code

// import { db } from '@/lib/firebaseAdmin';

// export default async function postHandler(req, res) {
//     // Making sure the method is always POST else return error message
//     if (req.method !== 'POST') {
//         return res.status(405).json({ error: 'Method not allowed' });
//     }

//     // Extract name from the request body
//     const { userId, name, role, applicationId } = req.body;

//     const getNextUserId = async () => {
//         const snapshot = await db.collection("Applications").doc(applicationId).collection("Users")
//           .orderBy("name", "desc") // Order by name (or any other field) to get the last document
//           .limit(1) // Only get the last document
//           .get({ source: "server" }); // Force fresh data from server
      
//         if (snapshot.empty) {
//           return "user001"; // If no documents, start with user001
//         }
    
//         const lastDoc = snapshot.docs[0];
//         const lastUserId = lastDoc.id;
//         console.log("Last user ID is: " + lastUserId);
      
//         // Assuming the ID pattern is 'app' followed by a number
//         const lastNumber = parseInt(lastUserId.replace('user', ''), 10);
//         const nextNumber = lastNumber + 1;
//         const nextUserId = `user${nextNumber.toString().padStart(3, '0')}`; // Pads the number to always be 3 digits
//         // console.log(nextUserId);
//         return nextUserId;
//     };

//     // Making sure there is a name being passed in the request body, else return error message
//     if(!name || !role || !applicationId) {
//         res.status(400).json({error: "Name, Role, and ApplicationId fields are required"})
//     } else {

//         try {
//             let nextUserId;
//             let userRef;
//             if(!userId) {
//                 nextUserId = await getNextUserId();
//                 // Reference to the Users subcollection under the specific ApplicationId document
//                 userRef = db.collection("Applications").doc(applicationId).collection("Users").doc(nextUserId);
//             } else if (userId) {
//                 // Reference to the Users subcollection under the specific ApplicationId document
//                 userRef = db.collection("Applications").doc(applicationId).collection("Users").doc(userId);
//             }
            
//             // Create the new user document
//             await userRef.set({
//                 name,
//                 role
//             });

//             res.status(200).json({ success: true, message: "User created successfully", newUser: {name: name, role: role, userId: userId || nextUserId} });
//         } catch (error) {
//             console.error('Error creating application:', error);
//             res.status(500).json({ error: 'Failed to create New User' });
//         }
//     }
// }

