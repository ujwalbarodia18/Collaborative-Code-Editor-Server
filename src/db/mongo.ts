import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = 'mongodb+srv://ujwalbarodia:Virattrmkohli18@cluster0.pv5af.mongodb.net/collaborative-code-editor';

  await mongoose.connect(uri);

  console.log('MongoDB connected');
}