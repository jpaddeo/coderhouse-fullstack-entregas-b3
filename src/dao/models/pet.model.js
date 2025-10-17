import mongoose from 'mongoose';

const collectionName = 'pets';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specie: {
    type: String,
    required: true,
  },
  birthDate: Date,
  adopted: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users',
  },
  image: String,
});

export const petModel = mongoose.model(collectionName, petSchema);
