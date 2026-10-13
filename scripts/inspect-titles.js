const mongoose = require('mongoose');
const uri = 'mongodb+srv://suhaibusmanizar_db_user:AT5sYzl8JjHIRRu8@cluster0.mo9pum9.mongodb.net/offroad?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
  await mongoose.connect(uri);
  const coll = mongoose.connection.db.collection('products');
  const prods = await coll.find({}, { projection: { title: 1, category_name: 1 } }).limit(20).toArray();
  prods.forEach((p, i) => console.log(`${i+1}. [${p.category_name || 'NO CAT'}] ${p.title}`));
  
  // also find a few Mercedes, BMW, Porsche, Range Rover
  const brands = ['BMW', 'Mercedes', 'Porsche', 'Range Rover', 'Volvo', 'Jaguar'];
  for (const b of brands) {
    const item = await coll.findOne({ title: { $regex: b, $options: 'i' } });
    if (item) {
      console.log(`\nSample ${b}: ${item.title}`);
    }
  }
  process.exit(0);
}

run().catch(console.error);

