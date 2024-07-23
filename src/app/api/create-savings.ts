// /pages/api/create-savings.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createSavingsListing } from "../actions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("i recieved a request");
  if (req.method === "POST") {
    const formData = req.body;
    try {
      const data = await createSavingsListing(formData);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
