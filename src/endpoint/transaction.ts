import { Application, Request, Response } from 'express'
import { getUser, updateUser } from '../database'
import { addTransaction } from '../database/transaction'
import { getStargateWalletAndClient } from '../service/client'
import { StargateWalletAndClient, Transaction, User } from '../type'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { SigningStargateClient, Coin, StdFee } from '@cosmjs/stargate'
import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate'
import { convertUTCDateToLocalDate } from '../service/date'
import NodeRSA from 'node-rsa'
import { getPublicKey } from '../database/publicKey'

export const transactionEndpoint = (app: Application) => {

    const exponent = 1 / 1000000
    const inverseExponent = 1000000
    app.post('/deposit', async (request: Request, response: Response) => {
        let responseBody: { status: true, user: User } | { status: false, error: string } =
            { status: false, error: '' }
        try {
            const requestBody: { txHash: string, address: string, signature: string, browserToken: string } = request.body
            const matchedAddress: string = requestBody.address
            const txHash: string = requestBody.txHash
            const signature: string = requestBody.signature
            const browserToken: string = requestBody.browserToken
            const lcdEndpontTxHash: string | undefined = process.env.LCD_ENDPOINT_TXHASH
            if (typeof lcdEndpontTxHash != 'undefined') {
                // data fetched from response
                const fetchRequestBody = await (await fetch(lcdEndpontTxHash + txHash)).json()
                const sender: string = fetchRequestBody.tx.body.messages[0].from_address
                const receiver: string = fetchRequestBody.tx.body.messages[0].to_address
                const result: boolean = fetchRequestBody.tx_response.code == 0
                const amount: number = Number.parseInt(fetchRequestBody.tx.body.messages[0].amount[0].amount) * exponent
                const fee: number = Number.parseInt(fetchRequestBody.tx.auth_info.fee.amount[0].amount) * exponent
                const height: number = Number.parseInt(fetchRequestBody.tx_response.height)
                const time: Date = new Date(fetchRequestBody.tx_response.timestamp)
                const publicKey: string | null = await getPublicKey(browserToken)
                if (publicKey == null) return
                const key: NodeRSA = new NodeRSA(publicKey)
                const signResult = key.verify(txHash, Buffer.from(signature))
                if (signResult) {
                    responseBody = { status: false, error: 'Verify failed' }
                    throw new Error()
                }
                // handle db
                if (matchedAddress != sender) {
                    responseBody = { status: false, error: 'Address is not matched' }
                    throw new Error()
                }

                // 15 seconds for a single transaction
                if (Date.now() - time.getTime() > 15 * 1000) {
                    responseBody = { status: false, error: 'Transaction time out' }
                    throw new Error()
                }
                const transaction: Transaction = {
                    txHash: txHash,
                    sender: sender,
                    receiver: receiver,
                    result: result,
                    amount: amount,
                    fee: fee,
                    height: height,
                    time: convertUTCDateToLocalDate(time)
                }
                await addTransaction(transaction)
                if (!result) {
                    responseBody = { status: false, error: 'Transaction result is false' }
                    throw new Error()
                }
                const user: User | null = await getUser(sender)
                if (user != null) {
                    user.asset += amount
                    await updateUser(user)
                    responseBody = { status: true, user: user }
                }
            }
        }
        catch (error: unknown) {
            //no code  
        }
        finally {
            response.json(responseBody)
        }
    }
    )
    app.post('/withdraw', async (request: Request, response: Response) => {
        let responseBody: { status: true, user: User } | { status: false, error: string } =
            { status: false, error: '' }
        try {
            const requestBody: { address: string, amount: number } = request.body
            const address = requestBody.address
            const requestAmount = requestBody.amount
            const currentUser: User | null = await getUser(address)
            if (currentUser != null) {
                if (currentUser.asset < requestAmount) {
                    responseBody = { status: false, error: 'Asset does not have enough money' }
                    throw new Error()
                }
                const stargateWalletAndClinet: StargateWalletAndClient = await getStargateWalletAndClient()
                const lcdEndpontTxHash: string | undefined = process.env.LCD_ENDPOINT_TXHASH
                const denom: string | undefined = process.env.DENOM
                if (typeof stargateWalletAndClinet.wallet != 'undefined' &&
                    typeof stargateWalletAndClinet.client != 'undefined' &&
                    typeof lcdEndpontTxHash != 'undefined' &&
                    typeof denom != 'undefined') {
                    const wallet: DirectSecp256k1HdWallet = stargateWalletAndClinet.wallet
                    const client: SigningStargateClient = stargateWalletAndClinet.client
                    const serverAddress = (await wallet.getAccounts())[0].address
                    const serverBalance: Coin = await client.getBalance(serverAddress, denom)
                    const serverBalanceValue = Number.parseInt(serverBalance.amount) * exponent
                    if (serverBalanceValue < requestAmount + 1) {
                        // ensure that server always have money
                        responseBody = { status: false, error: 'Server does not have enough money' }
                        throw new Error()
                    }
                    const sendAmount: Coin[] = [
                        {
                            denom: denom,
                            amount: (requestAmount * inverseExponent).toString()
                        }
                    ]
                    const sendFee: StdFee = {
                        amount: [{ denom: denom, amount: '200' }],
                        gas: '200000'
                    }
                    const withdrawResult: DeliverTxResponse = await client.sendTokens(
                        serverAddress,
                        address,
                        sendAmount,
                        sendFee
                    )
                    const txHash = withdrawResult.transactionHash
                    //query to get result
                    const fetchRequestBody = await (await fetch(lcdEndpontTxHash + txHash)).json()
                    const sender: string = fetchRequestBody.tx.body.messages[0].from_address
                    const receiver: string = fetchRequestBody.tx.body.messages[0].to_address
                    const result: boolean = fetchRequestBody.tx_response.code == 0
                    const amount: number = Number.parseInt(fetchRequestBody.tx.body.messages[0].amount[0].amount) * exponent
                    const fee: number = Number.parseInt(fetchRequestBody.tx.auth_info.fee.amount[0].amount) * exponent
                    const height: number = Number.parseInt(fetchRequestBody.tx_response.height)
                    const time: Date = new Date(fetchRequestBody.tx_response.timestamp)
                    const transaction: Transaction = {
                        txHash: txHash,
                        sender: sender,
                        receiver: receiver,
                        result: result,
                        amount: amount,
                        fee: fee,
                        height: height,
                        time: time
                    }
                    await addTransaction(transaction)
                    const user: User | null = await getUser(receiver)
                    if (user != null) {
                        user.asset -= requestAmount
                        await updateUser(user)
                        responseBody = { status: true, user: user }
                    }
                }
            }
        } catch (error: unknown) {
            //no code  
        }
        finally {
            response.json(responseBody)
        }
    }
    )
} 
