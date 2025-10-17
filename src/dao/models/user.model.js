import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  pets: {
    type: [
      {
        pet: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'pets',
        },
      },
    ],
    default: [],
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
    default: [],
  },
});

export const userModel = mongoose.model(userCollection, userSchema);
