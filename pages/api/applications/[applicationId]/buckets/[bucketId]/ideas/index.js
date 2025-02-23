import postIdea from '@/lib/postIdeas';
import getIdea from '@/lib/getIdeas';

export default async function postHandler(req, res) {

    // Extract applicationId and bucketId from the query parameters
    const applicationId = req.query.applicationId;
    const bucketId = req.query.bucketId;

    // Extract text and metadata from the request body
    const {text, metadata} = req.body;

    // Handle different HTTP methods
    if (req.method === "POST") {
        // Call the function to create a new idea inside the specified bucket
        postIdea(req, res, applicationId, bucketId, text, metadata);

    } else if (req.method === "GET") {
        // Call the function to retrieve ideas from the specified bucket
        getIdea(req, res, applicationId, bucketId);

    } else {
        // Return a 400 (Bad Request) response if the method is not supported
        return res.status(400).json({message: "Method not allowed"});
    }
}

