import { db } from '../config/dbConfig.js'

const Accounts = db.accounts

//get todas as contas
const getAll = async (_, res) => {
  try {
    const data = await Accounts.find({})
    res.send(data)
  } catch (error) {
    res.status(500).send('Erro ao tentar trazer as contas: Erro: ' + error)
  }
}

//deposito
const deposit = async (req, res) => {
  const { agencia, conta, valor } = req.params
  try {
    const query = await Accounts.find({ agencia: agencia, conta: conta })
    const accnt = query[0]

    if (!accnt) {
      res.status(404).send('Conta não existe')
    } else {
      const data = await Accounts.findByIdAndUpdate(
        { _id: accnt._id },
        { $inc: { balance: +valor } },
        { new: true }
      )
      console.log(data)
      res.send(`getBalance da conta: ${data.balance}`)
    }
  } catch (error) {
    res.status(500).send('Nao foi possível fazer o depósito! Erro: ' + error)
  }
}

//saque
const plunder = async (req, res) => {
  const { agencia, conta, plunder } = req.params
  try {
    const query = await Accounts.find({ agencia: agencia, conta: conta })
    console.log(query)
    const accnt = query[0]
    console.log(accnt.balance)

    if (!accnt) {
      res.status(404).send('Conta não existe')
    } else {
      const newBalance = accnt.balance - (+plunder + 1)
      console.log(+newBalance)

      if (newBalance < 0) {
        res.status(404).send('O getBalance não permite o plunder!')
      } else {
        const data = await Accounts.findByIdAndUpdate(
          { _id: accnt._id },
          { balance: +newBalance },
          { new: true }
        )
        console.log(data)
        res.send(`Saldo da consta após o saque: ${data.balance}`)
      }
    }
  } catch (error) {
    res.status(500).send('Nao foi possível fazer o plunder! Erro: ' + error)
  }
}
//saldo
const getBalance = async (req, res) => {
  const { agencia, conta } = req.params
  try {
    const query = await Accounts.find({ agencia: agencia, conta: conta })
    const accnt = query[0]
    if (!accnt) {
      res.status(404).send('Conta não existe')
    } else {
      res.send(`Saldo da conta: ${accnt.balance}`)
    }
  } catch (error) {
    res.status(500).send('Nao foi possível fazer o depósito! Erro: ' + error)
  }
}

const deleteAccount = async (req, res) => {
  const { agencia, conta } = req.params

  try {
    const query = await Accounts.find({ agencia: agencia, conta: conta })
    const accnt = query[0]

    if (!accnt) {
      res.status(404).send('Conta não existe')
    } else {
      await Accounts.findByIdAndDelete({ _id: accnt.id }, async () => {
        try {
          const totalAccounts = await Accounts.countDocuments({
            agencia: agencia,
          })
          console.log(totalAccounts)
          res.send(
            `Total de contas da Agencia nº ${agencia} : ${totalAccounts} contas`
          )
        } catch (error) {
          res.status(500).send('Erro ao tentar excluir a conta! Erro: ' + error)
        }
      })
    }
  } catch (error) {
    res.status(500).send('Erro ao tentar excluir a conta! Erro: ' + error)
  }
}

//transferencia
const transfer = async (req, res) => {
  const { contaOrigem, contaDestino, valor } = req.params
  let taxa = 0
  const query = await Accounts.find({ conta: contaOrigem })
  const accntOrigem = query[0]
  const query2 = await Accounts.find({ conta: contaDestino })
  const accntDestino = query2[0]

  try {
    if (!accntOrigem || !accntDestino) {
      res.status(404).send('Conta de origem ou destino não existem!')
    } else {
      if (accntDestino.agencia !== accntOrigem.agencia) taxa += 8

      //saque
      const newBalance = accntOrigem.balance - (+valor + taxa)
      console.log(newBalance)
      if (newBalance < 0) {
        res.status(404).send('O saldo não permite o saque!')
      } else {
        const data = await Accounts.findByIdAndUpdate(
          { _id: accntOrigem._id },
          { balance: newBalance },
          { new: true } //pega novo objeto atualizado
        )
        //deposito
        await Accounts.findByIdAndUpdate(
          { _id: accntDestino._id },
          { $inc: { balance: +valor } },
          { new: true }
        )
        console.log(data)
        res.send(`Saldo na conta de destino: ${data.balance}`)
      }
    }
  } catch (error) {
    res
      .status(500)
      .send('Erro ao tentar transferir entre contas! Erro: ' + error)
  }
}
const averageBalance = async (req, res) => {
  const agenc = req.params.ag

  try {
    const query = await Accounts.aggregate([
      { $match: { agencia: +agenc } },
      {
        $group: { _id: null, average: { $avg: '$balance' } },
      },
    ])

    console.log(+agenc)
    console.log('Query: ' + query)

    console.log('Query total: ' + query.length)

    if (query.length === 0) {
      throw new Error('Agência não existe!')
    }

    const accnt = query[0]
    console.log('accnt: ' + accnt)
    console.log('accnt.average: ' + accnt.average)
    res.send(
      `Média de saldos da agencência de n° ${agenc} :  ${accnt.average} reais`
    )
  } catch (error) {
    res.status(500).send('Nao foi possível fazer a média! Erro: ' + error)
  }
}

const lessBalance = async (req, res) => {
  const { numclients } = req.params

  try {
    if (+numclients < 1) {
      throw new Error('Parânetri número de clientes errado!')
    }
    const query = await Accounts.find(
      {},
      {
        _id: false,
        agencia: '$agencia',
        conta: '$conta',
        balance: '$balance',
      }
    )
      .sort({ balance: 1 })
      .limit(+numclients)

    res.send(query)
  } catch (error) {
    res.status(500).send('Nao foi possível : ' + error)
  }
}

const moreBalance = async (req, res) => {
  const { numclients } = req.params

  if (numclients < 1) {
    throw new Error('Parânetro número de clientes errado!')
  }
  try {
    const query = await Accounts.find(
      {},
      {
        _id: false,
        agencia: '$agencia',
        conta: '$conta',
        name: '$name',
        balance: '$balance',
      }
    )
      .sort({ balance: -1, name: 1 })
      .limit(+numclients)

    // const query = await Accounts.aggregate([
    //   {
    //     $project: {
    //       _id: false,
    //       agencia: '$agencia',
    //       conta: '$conta',
    //       name: '$name',
    //       saldo: '$balance',
    //     },
    //   },
    //   { $limit: +numclients },
    //   { $sort: { balance: -1, name: 1 } },
    // ]);

    res.send(query)
  } catch (error) {
    res.status(500).send('Nao foi possível : ' + error)
  }
}

const privateAccounts = async (req, res) => {
  try {
    const query = await Accounts.aggregate([
      {
        $project: {
          _id: 1,
          agencia: '$agencia',
          conta: '$conta',
          balance: '$balance',
        },
      },
      {
        $group: {
          _id: { agencia: '$agencia', conta: '$conta' },
          saldo: { $sum: '$balance' },
        },
      },
      { $sort: { balance: 1 } },
      { $limit: 10 },
    ])

    console.log(query)
    res.send(query)
  } catch (error) {
    res.status(500).send('Nao foi possível : ' + error)
  }
}

export default {
  getAll,
  deposit,
  plunder,
  getBalance,
  deleteAccount,
  transfer,
  averageBalance,
  lessBalance,
  moreBalance,
  privateAccounts,
}
