import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { SigningStargateClient } from '@cosmjs/stargate'
export type CosmWasmWalletAndClient = {
  wallet?: DirectSecp256k1HdWallet,
  client? : SigningCosmWasmClient
}
export type StargateWalletAndClient = {
    wallet?: DirectSecp256k1HdWallet,
    client? : SigningStargateClient
  }