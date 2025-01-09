import { create, del, read, update } from "./crud.js";

class Products {
  static get({ productId }) {
    return read({ id: productId });
  }

  static getAll() {
    return read({ all: true });
  }

  static async add({ title, price, company }) {
    const [{ insertId: id }] = await create({ title, price, company });
    return await read({ id });
  }

  /**
   *
   * @param {Object} param0
   * @param {number} param0.productId
   * @param {Object} param0.modifiableValues
   * @param {string} param0.modifiableValues.title
   * @param {number} param0.modifiableValues.price
   */
  static async modify({ productId, modifiableValues }) {
    const { id } = await update({
      id: productId,
      newValue: modifiableValues,
      completelyNew: false,
    });
    return await read({ id });
  }

  static remove({ productId }) {
    return del({ id: productId });
  }
}

export default Products;
