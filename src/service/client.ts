import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate'
import { DirectSecp256k1HdWallet, DirectSecp256k1HdWalletOptions } from '@cosmjs/proto-signing'
import { GasPrice, SigningStargateClient, SigningStargateClientOptions } from '@cosmjs/stargate'
import { CosmWasmWalletAndClient, StargateWalletAndClient } from '../type'

const mnemonic: string | undefined = process.env.MNEMONIC
const prefix: string | undefined = process.env.PREFIX
const rpcEndpoint: string | undefined = process.env.RPC_ENDPOINT
let gasPrice: GasPrice | undefined = undefined
const gasPriceString: string | undefined = process.env.GAS_PRICE
if (typeof gasPriceString != 'undefined') {
    gasPrice = GasPrice.fromString(gasPriceString)
}

export const getCosmWasmWalletAndClient =
    async (): Promise<CosmWasmWalletAndClient> => {
        const result: CosmWasmWalletAndClient = {}
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
            const walletOptions: Partial<DirectSecp256k1HdWalletOptions> =
            {
                prefix: prefix
            }
            const wallet: DirectSecp256k1HdWallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, walletOptions)
            result.wallet = wallet
            const clientOptions: SigningCosmWasmClientOptions =
            {
                gasPrice: gasPrice
            }
            result.client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet, clientOptions)
        }
        return result
    }

export const getStargateWalletAndClient =
    async (): Promise<StargateWalletAndClient> => {
        const result: StargateWalletAndClient = {}
        if (typeof mnemonic != 'undefined' &&
            typeof prefix != 'undefined' &&
            typeof rpcEndpoint != 'undefined' &&
            typeof gasPrice != 'undefined') {
            const walletOptions: Partial<DirectSecp256k1HdWalletOptions> =
            {
                prefix: prefix
            }
            const wallet: DirectSecp256k1HdWallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, walletOptions)
            result.wallet = wallet
            const clientOptions: SigningStargateClientOptions = {
                gasPrice: gasPrice
            }
            result.client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, clientOptions)
        }
        return result
    }