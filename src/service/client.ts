import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate'
import { DirectSecp256k1HdWallet, DirectSecp256k1HdWalletOptions } from '@cosmjs/proto-signing'
import { GasPrice, SigningStargateClient, SigningStargateClientOptions } from '@cosmjs/stargate'

const mnemonic: string | undefined = process.env.MNEMONIC
const prefix: string | undefined = process.env.PREFIX
const rpcEndpoint: string | undefined = process.env.RPC_ENDPOINT
let gasPrice: GasPrice | undefined = undefined
const gasPriceString: string | undefined = process.env.GAS_PRICE
if (typeof gasPriceString != 'undefined') {
    gasPrice = GasPrice.fromString(gasPriceString)
}

export const getCosmWasmClient =
    async (): Promise<SigningCosmWasmClient | null> => {
        let result: SigningCosmWasmClient | null = null
        const mnemonic: string | undefined = process.env.MNEMONIC
        const prefix: string | undefined = process.env.PREFIX
        const rpcEndpoint: string | undefined = process.env.RPC_ENDPOINT
        let gasPrice: GasPrice | undefined = undefined
        const gasPriceString: string | undefined = process.env.GAS_PRICE
        if (typeof gasPriceString != 'undefined') {
            gasPrice = GasPrice.fromString(gasPriceString)
        }
        if (typeof mnemonic != 'undefined' &&
            typeof prefix != 'undefined' &&
            typeof rpcEndpoint != 'undefined' &&
            typeof gasPrice != 'undefined') {

            const walletOptions: Partial<DirectSecp256k1HdWalletOptions> = {
                prefix: prefix,
            }
            const wallet: DirectSecp256k1HdWallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, walletOptions)

            const clientOptions: SigningCosmWasmClientOptions =
            {
                gasPrice: gasPrice
            }
            result = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet, clientOptions)
        }
        return result
    }

export const getStargateClient =
    async (): Promise<SigningStargateClient | null> => {
        let result: SigningStargateClient | null = null
        if (typeof mnemonic != 'undefined' &&
            typeof prefix != 'undefined' &&
            typeof rpcEndpoint != 'undefined' &&
            typeof gasPrice != 'undefined') {
            const walletOptions: Partial<DirectSecp256k1HdWalletOptions> = {
                prefix: prefix,
            }
            const wallet: DirectSecp256k1HdWallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, walletOptions)
            const clientOptions: SigningStargateClientOptions = {
                gasPrice: gasPrice
            }
            result = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, clientOptions)
        }
        return result
    }