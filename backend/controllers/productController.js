import { sql } from "../config/db.js";

//CRUD
//C= create
//R= read
//U= update
//D= delete


export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `;

    console.log("fetched products", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error getAllProducts", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;
  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const newProduct = await sql`
        INSERT INTO products (name, price, image)
        VALUES (${name}, ${price}, ${image})
        RETURNING *
        `;

    console.log("product added", newProduct[0]);
    //201= new resource created
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.log("Error createProduct", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
        SELECT * FROM products
        WHERE id = ${id}
        `;

    console.log("product retrieved ", product);
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error getProduct", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  try {
    const updatedProduct = await sql`
        UPDATE products
        SET name=${name}, price=${price}, image=${image}
        WHERE id = ${id}
        RETURNING *
        `;
    if (updatedProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: updatedProduct[0],
      });
    } else {
      return res.status(201).json({ success: true, data: updatedProduct[0] });
    }
  } catch (error) {
    console.log("Error updatedProduct", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await sql`
        DELETE FROM products
        WHERE id = ${id}
        RETURNING *
        `;

    console.log("product deleted ", deletedProduct[0]);
    if (deletedProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    } else {
      return res
        .status(200)
        .json({
          success: true,
          message: "Product deleted",
          data: deletedProduct[0],
        });
    }
  } catch (error) {
    console.log("Error deleteProduct", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
