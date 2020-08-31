import express from 'express'
import { accountsRouter } from './routes/accountsRouter.js'
import { db } from './config/dbConfig.js'

;(async () => {
  try {
    await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    console.log('Conectado Mongoose Atlas com sucesso!')
  } catch (error) {
    console.log('Erro ao conectar com o banco! Erro: ' + error)
  }
})()

const app = express()
app.use(express.json())
app.use(accountsRouter)

app.listen(process.env.PORT, () => {
  try {
    console.log('API em execução')
  } catch (error) {
    console.log('Erro ao subir a aplicação" Erro: ' + error)
  }
})
//para subir a aplicação
//node -r dotenv/config --experimental-modules app.js
//nodemon -r dotenv/config --experimental-modules app.js
