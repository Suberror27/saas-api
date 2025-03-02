import { db } from '@/lib/firebaseAdmin';
import updateUser from '@/lib/updateUser'; // Import the updateUser function
import getUser from '@/lib/getUser'; // Import the getUser function

export default async function patchGetHandler(req, res) {

    // Extract applicationId and userId from the query parameters
    const applicationId = req.query.applicationId;
    const userId = req.query.userId;

    // Extract user details from the request body
    const {name, roles} = req.body;

    // Handle different HTTP methods
    if (req.method === "PATCH") {

        // Call updateUser function to update the user details
        updateUser(req, res, applicationId, userId, name, roles);
    } else if (req.method === "GET") {

        // Call getUser function to retrieve user details
        getUser(req, res, applicationId, userId);
    } else {

         // Return an error for unsupported HTTP methods
        return res.status(405).json({ error: "Method not allowed" });
    }
}