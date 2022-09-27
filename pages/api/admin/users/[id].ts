import User from '../../../../models/User';
import db from '../../../../utils/db';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || !session?.user?.isAdmin) {
    return res.status(401).send('admin signin required');
  }

  if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const deleteHandler = async (req: NextApiRequest, res:NextApiResponse) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    if (user.email === 'admin@example.com') {
      return res.status(400).send({ message: 'Nie można usunąć admina' });
    }
    await user.remove();
    await db.disconnect();
    res.send({ message: 'Użytkownik usunięty' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Nie znaleziono użytkownika' });
  }
};

export default handler;