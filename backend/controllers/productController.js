const Product = require('../models/Product');
const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  image: Joi.string()
});

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.createProduct = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: 'Admin only' });

  const { error } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const product = new Product(req.body);
  await product.save();
  res.json(product);
};

// Add update and delete similarly...
exports.updateProduct = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: 'Admin only' });
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ msg: 'Product not found' });
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ msg: 'Admin only' });
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
};