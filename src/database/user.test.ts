import { User } from '../type'
import { createUser, getUser } from './user'

describe('User model tests', () => {
    test('To create user function test', async () => {
        const sample: User =
    {
        address: 'sample address' + Date.now().toString(),
        username: 'sampe username',
        asset: 10
    }
    // success
        expect(await createUser(sample)).toBeTruthy()
        // fail, due to primary key confliction
        expect(await createUser(sample)).toBeFalsy()
    }
    )
    test('To get user function test', async () => {
        const expected: User = 
    {
        address: 'aura1xc67705clhg7ftfa0khmzq7z7kx87x7mrzlvuw',
        username: 'VuNT',
        asset: 0
    }
    // success
        expect(await getUser('aura1xc67705clhg7ftfa0khmzq7z7kx87x7mrzlvuw')).toEqual(expected)
        // fail, due to primary key confliction
        expect(await getUser('wrong address')).toBeNull()
    })
}
)

