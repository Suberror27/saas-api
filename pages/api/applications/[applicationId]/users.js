import { db } from '@/lib/firebaseAdmin';

export default async function getHandler(req, res) {
    // Making sure the method is always POST else return error message
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const applicationId = req.query.applicationId;

    res.status(200).json({applicationId});
}
