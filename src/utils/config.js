import dotenv from 'dotenv';
dotenv.config();

const CONFIG = {
  MONGODB_URI:
    process.env.MONGODB_URI ||
    'mongodb+srv://coderhouse:codercoder2023@cluster0.wpxpupc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  PORT: process.env.PORT || 5000,
  BASE_URL: `${process.env.BASE_URL || 'http://localhost'}:${
    process.env.PORT || 5000
  }`,
};

export default CONFIG;
