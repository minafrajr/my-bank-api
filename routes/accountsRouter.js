import express from 'express';
import accountsController from '../controllers/accountsController.js';

const accountsRouter = express();
accountsRouter.use(express.json());

//prettier-ignore
accountsRouter.get('/', async(req, res) => {
    try {
        res.send("Bem vindo")
        
    } catch (error) {
        res.status(500).send()
    }
})
//prettier-ignore
accountsRouter.get('/accounts', accountsController.getAll)
//prettier-ignore
accountsRouter.get('/accounts/saldo/:agencia/:conta',  accountsController.getBalance);
//prettier-ignore
accountsRouter.get('/accounts/average/:ag',accountsController.averageBalance);
//prettier-ignore
accountsRouter.get('/accounts/lessbalance/:numclients',accountsController.lessBalance);
//prettier-ignore
accountsRouter.get('/accounts/morebalance/:numclients',accountsController.moreBalance);
//prettier-ignore
accountsRouter.put('/accounts/deposito/:agencia/:conta/:valor',accountsController.deposit);
//prettier-ignore
accountsRouter.put('/accounts/saque/:agencia/:conta/:plunder',  accountsController.plunder);
//prettier-ignore
accountsRouter.delete('/accounts/delete/:agencia/:conta/',accountsController.deleteAccount);
//prettier-ignore
accountsRouter.put('/accounts/transfer/:contaOrigem/:contaDestino/:valor',accountsController.transfer);
//prettier-ignore
accountsRouter.put('/accounts/privateaccounts',accountsController.privateAccounts);

export { accountsRouter };
