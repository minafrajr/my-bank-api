import mongoose from 'mongoose';
import accountsModel from '../models/accountsModels.js';

const db = {};
db.url = process.env.MONGO_URL;
db.mongoose = mongoose;
db.accounts = accountsModel(mongoose);

export { db };
