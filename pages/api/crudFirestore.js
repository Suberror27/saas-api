// import db from '@/lib/firebase';
import { db } from '@/lib/firebaseAdmin';

export default async function getHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const snapshot = await db.collection('Applications').get();
    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching Applications:', error);
    res.status(500).json({ error: 'Failed to fetch Applications' });
  }
}
