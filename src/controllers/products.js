import { Products } from "../db/index.js";
import { asyncWrapper } from "../middleware/index.js";

export const getAllProductsStatic = asyncWrapper(async (req, res, next) => {
  res.status(200).json({ message: "Get All Products Static Test" });
});

export const getAllProducts = asyncWrapper(async (req, res, next) => {
  const products = await Products.getAll();
  res.status(200).json({ products: products });
});

export const getProduct = asyncWrapper(async (req, res, next) => {
  const product = await Products.get({ productId: req.params.id });
  res.status(200).json({ product: product });
});

export const addNewProduct = asyncWrapper(async (req, res, next) => {
  const product = await Products.add(req.body);
  res.status(200).json({ product: product });
});

export const updateProduct = asyncWrapper(async (req, res, next) => {
  const product = await Products.modify({
    productId: req.params.id,
    modifiableValues: req.body,
  });

  res.status(200).json({ product: product });
});

export const deleteProduct = asyncWrapper(async (req, res, next) => {
  const info = await Products.remove({ productId: req.params.id });
  res.status(200).json({ info: info });
});
