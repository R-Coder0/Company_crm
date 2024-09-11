const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true }, // Ensure this is required
  },
  address: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  callLogs: [
    {
      comment: { type: String, required: true }, // Make sure this is required
      callStatus: { type: String, required: true }, // Make sure this is required
      screenshotUrl: { type: String },
      timestamp: { type: Date, default: Date.now },
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
});

module.exports = mongoose.model('Client', clientSchema);
