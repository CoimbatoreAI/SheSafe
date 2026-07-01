const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema);

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updatedCount = 0;
    for (const product of products) {
      if (product.section && !product.sections) {
        product.sections = [product.section];
        await product.save();
        updatedCount++;
      }
    }

    console.log(`Successfully migrated ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
