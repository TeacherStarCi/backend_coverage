import { Transaction } from '../type'
import {getTransaction, addTransaction} from './transaction'

describe('transaction model tests', () => {
    test('to add transaction function test', async () => {
        const transaction: Transaction = {
            txHash: '123 dep trai' + Date.now().toString(),
            sender: 'aura1xc67705clhg7ftfa0khmzq7z7kx87x7mrzlvuw',
            receiver: 'aura1w0ten4x8faffehzsjuae3v9jj5xt45qutwk0te',
            result: true,
            amount: 20,
            fee: 5,
            height: 123,
            time: new Date()
        }
        // add new transaction
        expect(await addTransaction(transaction)).toBeTruthy()
        // add a duplicated transaction
        expect(await addTransaction(transaction)).toBeFalsy()
    })
    test('to get transaction function test', async () => {
        const address = 'aura1w0ten4x8faffehzsjuae3v9jj5xt45qutwk0te'
        // get transaction with right tx hash
        expect((await getTransaction(address, 'deposit')).length).toBeGreaterThan(0)
        // get transaction with wrong tx hash  
        expect((await getTransaction('wrong address', 'deposit')).length).toBe(0)
    })
})