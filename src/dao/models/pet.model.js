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
});

export const petModel = mongoose.model(collectionName, petSchema);
