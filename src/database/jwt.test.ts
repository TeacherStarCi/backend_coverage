
import { jwtSignWithHashSecret } from '../hash'
import { addJwtToken, getLastedJwtTokenMatchedAddress } from './jwt'
describe('Jwt model test', () => {
    test('To add jwt token test', async () => {
        const token = '123deptrai' + Date.now().toString()
        //add new token
        expect(await addJwtToken(token)).toBeTruthy()
        //add duplicated token
        expect(await addJwtToken(token)).toBeFalsy()
    }
    )
    test('To get lasted jwt token matched address test', async () => {
        // add lastest token
        const address = 'aura1xc67705clhg7ftfa0khmzq7z7kx87x7mrzlvuw'
        const token = jwtSignWithHashSecret(address, 60 * 60)
        await addJwtToken(token)
        // check token if address true
        expect(await getLastedJwtTokenMatchedAddress(address)).toEqual(token)
        // check token if address false
        expect(await getLastedJwtTokenMatchedAddress('wrong address')).toEqual('')
    })
})
