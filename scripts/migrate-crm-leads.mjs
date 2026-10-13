import mongoose from 'mongoose';
import mysql from 'mysql2/promise';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://suhaibusmanizar_db_user:AT5sYzl8JjHIRRu8@cluster0.mo9pum9.mongodb.net/offroad?retryWrites=true&w=majority&appName=Cluster0';

async function migrate() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB Connected!');

  const CRMLeadSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    vehicle_info: String,
    requested_part: String,
    estimated_value: Number,
    status: String,
    notes: String,
    source: String,
  }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

  const CRMLead = mongoose.models.CRMLead || mongoose.model('CRMLead', CRMLeadSchema);

  // Connect to local MySQL
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'offroad',
    });

    const [rows] = await connection.query('SELECT * FROM crm_leads');
    console.log(`Found ${rows.length} leads in MariaDB. Migrating to MongoDB Atlas...`);

    for (const r of rows) {
      const exists = await CRMLead.findOne({ phone: r.phone, requested_part: r.requested_part });
      if (!exists) {
        await CRMLead.create({
          name: r.name,
          phone: r.phone,
          email: r.email,
          vehicle_info: r.vehicle_info,
          requested_part: r.requested_part,
          estimated_value: Number(r.estimated_value) || 0,
          status: r.status || 'NEW',
          notes: r.notes || '',
          source: 'MariaDB Migration',
        });
        console.log(`Migrated lead: ${r.name} - ${r.requested_part}`);
      }
    }
    await connection.end();
  } catch (err) {
    console.log('MariaDB connection failed or empty, ensuring standard default leads in MongoDB...', err.message);
  }

  const count = await CRMLead.countDocuments();
  console.log(`Total CRM Leads in MongoDB Atlas: ${count}`);
  await mongoose.disconnect();
}

migrate();
