import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure user field is referenced
}, { timestamps: true });

carSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Car = mongoose.model('Car', carSchema);

export default Car;
