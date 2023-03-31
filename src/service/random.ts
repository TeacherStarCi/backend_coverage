import { ExecuteResult, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { DirectSecp256k1HdWallet, AccountData } from '@cosmjs/proto-signing'
import { Coin } from '@cosmjs/stargate'
import { addDeck } from '../database'
import { getHashedFromCurrentTimestamp } from '../hash'
import { CardPosition, CosmWasmWalletAndClient, DeckWithTxHash } from '../type'
import { getCosmWasmWalletAndClient } from './client'

export const getDecksFromContract
    = async (): Promise<string> => {
        let result = ''
        const denom: string | undefined = process.env.DENOM
        const cardGameContract: string | undefined = process.env.CARD_GAME_CONTRACT
        if (typeof cardGameContract != 'undefined') {
            const cosmWasmWalletAndClient: CosmWasmWalletAndClient
                = await getCosmWasmWalletAndClient()

            if (typeof cosmWasmWalletAndClient.wallet != 'undefined' &&
                typeof cosmWasmWalletAndClient.client != 'undefined'
            ) {
                const wallet: DirectSecp256k1HdWallet = cosmWasmWalletAndClient.wallet
                const client: SigningCosmWasmClient = cosmWasmWalletAndClient.client
                const server: AccountData = (await wallet.getAccounts())[0]
                const serverAddress = server.address
                const requestId: string = getHashedFromCurrentTimestamp('request')
                const funds: Coin[] = [
                    {
                        denom: denom,
                        amount: '300'
                    }
                ]
                const excuteResult: ExecuteResult = await client.execute(
                    serverAddress,
                    cardGameContract,
                    {
                        shuffle_deck:
                        {
                            request_id: requestId,
                        }
                    },
                    'auto',
                    '',
                    funds
                )
                result = excuteResult.transactionHash
                let deckSet: { decks: number[][] } | null = null
                const sleep = async (ms: number): Promise<NodeJS.Timeout> =>
                    setTimeout(() => {
                        // do nothing
                    }, ms)
                while (!deckSet) {
                    deckSet = await client.queryContractSmart(cardGameContract, {
                        get_decks:
                        {
                            request_id: requestId,
                            num: 10
                        }
                    }
                    )
                    await sleep(5000)
                    console.log(deckSet)
                }
                if (deckSet != null) {
                    const length: number = deckSet.decks.length
                    for (let i = 0; i < length; i++) {
                        let j = 0
                        const cardPositions: CardPosition[] = deckSet.decks[i].map(cardValue => {
                            j++
                            return {
                                cardValue: cardValue,
                                cardPosition: j
                            }
                        }
                        )
                        const deckWithTransactionHash: DeckWithTxHash = {
                            txHash: result,
                            index: i,
                            deck: cardPositions
                        }
                        await addDeck(deckWithTransactionHash)
                    }
                }
            }
        }
        return result
    }


