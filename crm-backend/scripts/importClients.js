const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('csv-parser');
const Client = require('../models/Client');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Function to import clients from CSV
const importClients = (filePath) => {
  const clients = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      console.log('Row data:', row); // Add this line to check the data

      const client = {
        name: row['Business Name'],
        contactInfo: {
          phone: row['Phone_Number'],
        },
        address: row['Address'],
        website: row['website'],
        longitude: parseFloat(row['longitude']),
        latitude: parseFloat(row['latitude']),
      };
      clients.push(client);
    })
    .on('end', async () => {
      try {
        await Client.insertMany(clients);
        console.log('Client data successfully imported');
        mongoose.connection.close();
      } catch (error) {
        console.error('Error importing client data:', error);
        mongoose.connection.close();
      }
    });
};

// Run the import function with your CSV file path
importClients('D:\\CRM\\crm-backend\\Data\\Tattoo artist.csv');
