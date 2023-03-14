import { User } from '../type'
import { addUser, getUser, getUserWithTransaction, updateUser } from './user'

describe('User model tests', () => {
    const sample: User =
    {
        address: 'sample address' + Date.now().toString(),
        username: 'sampe username',
        asset: 10
    }
    const expected: User =
    {
        address: 'aura1xc67705clhg7ftfa0khmzq7z7kx87x7mrzlvuw',
        username: 'VuNT',
        asset: 69
    }
    // const expectedWithTransaction: User
    test('To create user function test', async () => {

        // success
        expect(await addUser(sample)).toBeTruthy()
        // fail, due to primary key confliction
        expect(await addUser(sample)).toBeFalsy()
    }
    )
    test('To get user function test', async () => {
        // success
        expect(await getUser('aura1xc67705clhg7ftfa0khmzq7z7kx87x7mrzlvuw')).toEqual(expected)
        // fail, due to primary key confliction
        expect(await getUser('wrong address')).toBeNull()
    }
    )
    test('To update user function test', async () => {
        // update
        expected.asset = 69
        expect(await updateUser(expected)).toBeUndefined()
        // create
        expect(await updateUser(sample)).toBeUndefined()
        // create
    }
    )
    test('To get user with transactions function test', async () => {
        // success
        expect((await getUserWithTransaction('aura1xc67705clhg7ftfa0khmzq7z7kx87x7mrzlvuw'))?.withdraws?.length).toBeGreaterThan(0)
        // fail, due to primary key confliction
        expect(await getUserWithTransaction('wrong address')).toBeNull()
    }
    )
}
)

