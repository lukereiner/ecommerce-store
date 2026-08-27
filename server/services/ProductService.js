const createError = require("http-errors");
const ProductModel = require("../models/productsModel");
const ProductModelInstance = new ProductModel();

module.exports = class ProductService {
  // find all products
  async findAll() {
    try {
      const products = await ProductModelInstance.findAll();

      if (!products) {
        throw createError(404, "No products in database");
      }

      const cleanProducts = products.map(( { created, modified, ...rest } ) => rest);

      return cleanProducts;
    } catch (err) {
      throw err;
    }
  }

  // find products by ID
  async get(data) {
    const { id } = data;

    try {
      // check if product already exists
      const product = await ProductModelInstance.findProductById(id);

      // if product doesn't exist, reject
      if (!product) {
        throw createError(404, "Product not found");
      }

      return product;
    } catch (err) {
      throw err;
    }
  }
};
