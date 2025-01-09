import { Router } from "express";

import {
  addNewProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsStatic,
  getProduct,
  updateProduct,
} from "../controllers/index.js";

const router = Router();

router.route("/").get(getAllProducts).post(addNewProduct);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);
router.route("/static").get(getAllProductsStatic);

export default router;
