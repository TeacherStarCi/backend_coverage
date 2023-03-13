import { getHashedFromCurrentTimestamp } from './sha256'
describe('SHA256 tests', () => {
    test('To get hashed from current timestamp function test', () => {
        expect(getHashedFromCurrentTimestamp('starcideptraiii')).not.toBe('')
    }
    )
}
)