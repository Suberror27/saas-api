import postIdea from '@/lib/postIdeas';
import getIdea from '@/lib/getIdeas';

export default async function postHandler(req, res) {
    const applicationId = req.query.applicationId;
    const bucketId = req.query.bucketId;
    const {text, metadata} = req.body;

    if (req.method === "POST") {
        postIdea(req, res, applicationId, bucketId, text, metadata);

    } else if (req.method === "GET") {
        getIdea(req, res, applicationId, bucketId);

    } else {
        return res.status(400).json({message: "Method not allowed"});
    }
}

