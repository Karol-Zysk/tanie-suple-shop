import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import Product from "../../../../../models/Product";
import db from "../../../../../utils/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || (session && !session?.user?.isAdmin)) {
    return res.status(401).send("signin required");
  }

  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "PUT") {
    return putHandler(req, res);
  } else if (req.method === "DELETE") {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};
const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};
const putHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);

  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await product.save();
    await db.disconnect();
    res.send({ message: "Product updated successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Product not found" });
  }
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: "Produkt usunięty prawidłowo" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Nie znaleziono produktu" });
  }
};
export default handler;
