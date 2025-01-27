import { db } from '@/lib/firebaseAdmin';
import updateUser from '@/lib/updateUser';
import getUser from '@/lib/getUser';

export default async function patchHandler(req, res) {
    const applicationId = req.query.applicationId;
    const userId = req.query.userId;
    const {name, roles} = req.body;

    if (req.method === "PATCH") {
        updateUser(req, res, applicationId, userId, name, roles);
    } else if (req.method === "GET") {
        getUser(req, res, applicationId, userId);
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}