import { NextApiRequest, NextApiResponse } from "next";

import {v2 as cloudinary} from "cloudinary"

export default function signature(req: NextApiRequest, res: NextApiResponse) {
  
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    `${process.env.CLOUDINARY_SECRET}`
  );

  res.statusCode = 200;
  res.json({ signature, timestamp });
}
