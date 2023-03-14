import { Card, CardedDecksWithTxHash, DecksWithTxHash } from '../type'
import { getMostValueableCardRank, getCardFromIndex, getCardLevel, getCardedDecks, getCardNameIndex, getHandRank, getHandState, getValueableCardRank } from './game'
describe('Game services tests', () => {
    const baseResult: Card[] = [
        {
            cardName: '3',
            suit: 'Diamonds'
        }, {
            cardName: '4',
            suit: 'Diamonds'
        }, {
            cardName: '7',
            suit: 'Diamonds'
        }
    ]
    const threeFaceCardsResult: Card[] = [
        {
            cardName: 'Jack',
            suit: 'Diamonds'
        }, {
            cardName: 'King',
            suit: 'Diamonds'
        }, {
            cardName: 'King',
            suit: 'Hearts'
        }
    ]
    const flushResult: Card[] = [
        {
            cardName: '5',
            suit: 'Diamonds'
        }, {
            cardName: '4',
            suit: 'Diamonds'
        }, {
            cardName: '3',
            suit: 'Diamonds'
        }
    ]
    const specialFlushResult: Card[] = [
        {
            cardName: 'Queen',
            suit: 'Diamonds'
        }, {
            cardName: 'Ace',
            suit: 'Diamonds'
        }, {
            cardName: 'King',
            suit: 'Diamonds'
        }
    ]
    const threeOfAKindResult: Card[] = [
        {
            cardName: '3',
            suit: 'Diamonds'
        }, {
            cardName: '3',
            suit: 'Spades'
        }, {
            cardName: '3',
            suit: 'Clubs'
        }
    ]
    const wrongResult: Card[] = []
    test('To get hand state function test', () => {

        //base result
        expect(getHandState(baseResult)).toEqual(
            {
                state: 'Base',
                level: 4
            }
        )
        //three face card result
        expect(getHandState(threeFaceCardsResult)).toEqual(
            {
                state: 'ThreeFaceCards'
            }
        )
        // flush result
        expect(getHandState(flushResult)).toEqual(
            {
                state: 'Flush',
                begin: 3
            }
        )
        expect(getHandState(specialFlushResult)).toEqual(
            {
                state: 'Flush',
                begin: 12
            }
        )
        // three of a kind
        expect(getHandState(threeOfAKindResult)).toEqual(
            {
                state: 'ThreeOfAKind',
                value: 3
            }
        )

        expect(getHandState(wrongResult)).toBeNull()
    }
    )
    test('To get hand rank function test', () => {
        //base hand
        expect(getHandRank(baseResult)).toBe(446)
        //three face cards
        expect(getHandRank(threeFaceCardsResult)).toBe(1052)
        //flush
        expect(getHandRank(flushResult)).toBe(1344)
        //three of a kind 
        expect(getHandRank(threeOfAKindResult)).toBe(10003)
        //wrong 
        expect(getHandRank(wrongResult)).toBe(-1)
    }
    )
    test('To get most valueable card rank function test', () => {
        //test base case
        expect(getMostValueableCardRank(baseResult)).toEqual(46)
        // test wrong case
        expect(getMostValueableCardRank(wrongResult)).toEqual(-1)
    }
    )
    test('To get valuable card rank function test', () => {
        //suit spades
        expect(getValueableCardRank({ cardName: 'Ace', suit: 'Spades' })).toBe(1)
        //suit clubs
        expect(getValueableCardRank({ cardName: 'Ace', suit: 'Clubs' })).toBe(14)
        //suit hearts
        expect(getValueableCardRank({ cardName: 'Ace', suit: 'Hearts' })).toBe(27)
        //suit diamonds
        expect(getValueableCardRank({ cardName: 'Ace', suit: 'Diamonds' })).toBe(40)
    }
    )
    test('To get card from index function test', () => {
        const card: Card = {
            cardName: 'Ace',
            suit: 'Spades'
        }
        // test with true card index from 1 to 52
        expect(getCardFromIndex(1)).toEqual(card)
        //get full coverage
        for (let i = 1; i <= 52; i++) {
            expect(getCardFromIndex(i)).not.toBeNull()
        }
        // test with wrong index
        expect(getCardFromIndex(-69)).toBeNull()
    }
    )
    test('To get card name function test', () => {
        // case Jack
        expect(getCardNameIndex('Jack')).toBe(11)
        // case Queen
        expect(getCardNameIndex('Queen')).toBe(12)
        // case King
        expect(getCardNameIndex('King')).toBe(13)
        // case Ace
        expect(getCardNameIndex('Ace')).toBe(1)
        // others
        expect(getCardNameIndex('7')).toBe(7)
    }
    )
    test('To get card level function test', () => {
        // test with each card level
        expect(getCardLevel('Ace')).toBe(1)
        expect(getCardLevel('2')).toBe(2)
        expect(getCardLevel('3')).toBe(3)
        expect(getCardLevel('4')).toBe(4)
        expect(getCardLevel('5')).toBe(5)
        expect(getCardLevel('6')).toBe(6)
        expect(getCardLevel('7')).toBe(7)
        expect(getCardLevel('8')).toBe(8)
        expect(getCardLevel('9')).toBe(9)
        expect(getCardLevel('10')).toBe(10)
        expect(getCardLevel('Jack')).toBe(10)
        expect(getCardLevel('Queen')).toBe(10)
        expect(getCardLevel('King')).toBe(10)
    }
    )
    test('To get carded decks test', () => {
        const decks: DecksWithTxHash = [
            {
                txHash: '123',
                index: 1,
                deck: [
                    {
                        cardPosition: 1,
                        cardValue: 1

                    },
                    {
                        cardPosition: 5,
                        cardValue: 2
                    }]
            },
            {
                txHash: '123',
                index: 2,
                deck: [
                    {
                        cardPosition: 13,
                        cardValue: 3
                    },
                    {
                        cardPosition: 27,
                        cardValue: 4
                    }]
            },
        ]
        const cardedDecks: CardedDecksWithTxHash = [
            {
                txHash: '123',
                index: 1,
                deck: [
                    {
                        cardName: 'Ace',
                        suit: 'Spades'

                    },
                    {
                        cardName: 'Ace',
                        suit: 'Clubs'
                    }]
            },
            {
                txHash: '123',
                index: 2,
                deck: [
                    {
                        cardName: 'Ace',
                        suit: 'Diamonds'

                    },
                    {
                        cardName: 'Ace',
                        suit: 'Hearts'
                    }]
            }
        ]
        expect(getCardedDecks(decks)).toEqual(cardedDecks)
    }
    )
}

)
