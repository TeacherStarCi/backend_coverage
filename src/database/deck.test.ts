import { addDeck, addDecks, getDecks } from './deck'
import { DecksWithTxHash, DeckWithTxHash } from '../type'
describe('Deck model tests', () => {
    const deck: DeckWithTxHash = {
        txHash: 'sample transaction hash' + Date.now().toString(),
        index: 5,
        deck: [{
            cardPosition: 1,
            cardValue: 4
        },
        {
            cardPosition: 2,
            cardValue: 3
        }]

    }
    const decks: DecksWithTxHash = [{
        txHash: 'sample transaction hash 1' + Date.now().toString(),
        index: 5,
        deck: [{
            cardPosition: 1,
            cardValue: 4
        },
        {
            cardPosition: 2,
            cardValue: 3
        }]

    }, {
        txHash: 'sample transaction hash 2' + Date.now().toString(),
        index: 5,
        deck: [{
            cardPosition: 1,
            cardValue: 4
        },
        {
            cardPosition: 2,
            cardValue: 3
        }]

    },
    ]
    test('To add deck function test', async () => {
        //if it a new deck
        expect(await addDeck(deck)).toBeTruthy()
        // if it a duplicated txHash
        expect(await addDeck(deck)).toBeFalsy()
    })
    test('To add decks function test', async () => {
        //if they are new decks
        expect(await addDecks(decks)).toEqual([true,true])
        // if they are duplicated txHashs
        expect(await addDecks(decks)).toEqual([false,false])
    })
    const txHash = '3992A29DBA5F5501E762A678E5BFAF2085FE283EBC42F0BEAA8AA53C7FCFC298'
    test('To get decks function test', async () => {
        const decksResultWithRightTxHash: DecksWithTxHash = await getDecks(txHash)
        const decksResultWithWrongTxHash: DecksWithTxHash = await getDecks('wrong transaction hash') 
        // test length
        expect(decksResultWithRightTxHash.length).toBeGreaterThan(0)
        expect(decksResultWithWrongTxHash.length).toBe(0)
    })
})