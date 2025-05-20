const Product = require('../Models/Product');

const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, image, category } = req.body;

    const product = new Product({
      name,
      description,
      price,
      quantity,
      image,
      category,
      createdBy: req.user._id
    });

    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ error: 'Product creation failed' });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'name email');
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
};



const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found or not owned by you' });

    Object.assign(product, req.body);
    await product.save();

    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};



const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found or not owned by you' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

const getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({createdBy: req.user._id});
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your products' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFarmerProducts
};