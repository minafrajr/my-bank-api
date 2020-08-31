import mongoose from 'mongoose'
import accountsModel from '../models/accountsModels.js'

//objeto de conexão com o banco
const db = {}
//a string de conexão com o banco
db.url = process.env.MONGO_URL
//o objeto mongoose
db.mongoose = mongoose
//o modelo de accounts tranzendo a função accountsModel de ./models/accountsModels.js
//passando o objeto mongoose como parâmetro
db.accounts = accountsModel(mongoose)

export { db }
