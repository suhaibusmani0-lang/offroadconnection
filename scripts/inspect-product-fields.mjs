import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://suhaibusmanizar_db_user:AT5sYzl8JjHIRRu8@cluster0.mo9pum9.mongodb.net/offroad?retryWrites=true&w=majority&appName=Cluster0';

async function check() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  
  const sample = await Product.findOne({ id: 4 }).lean();
  console.log('Sample Product in MongoDB:');
  console.log({
    id: sample.id,
    name: sample.name,
    sku: sample.sku,
    part_number: sample.part_number,
    short_description: sample.short_description?.slice(0, 100),
    description: sample.description?.slice(0, 150),
    specifications: sample.specifications,
    category: sample.category,
    make: sample.make,
    model_compatibility: sample.model_compatibility,
    year_compatibility: sample.year_compatibility,
  });

  // Check how many have part_number or descriptions
  const total = await Product.countDocuments();
  const withDesc = await Product.countDocuments({ description: { $exists: true, $ne: '' } });
  const withShortDesc = await Product.countDocuments({ short_description: { $exists: true, $ne: '' } });
  const withPartNum = await Product.countDocuments({ part_number: { $exists: true, $ne: '' } });
  
  console.log({ total, withDesc, withShortDesc, withPartNum });

  await mongoose.disconnect();
}

check();

