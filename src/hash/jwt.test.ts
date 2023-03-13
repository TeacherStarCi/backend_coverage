import { DecodedJwtToken } from '../type'
import { jwtDecodeWithHashSecret, jwtSignWithHashSecret } from './jwt'
describe('Jwt sign/verify tests', () => {
    test('To sign & verify with hash secret function test', () => {
        const address = 'aura1xc67705clhg7ftfa0khmzq7z7kx87x7mrzlvuw'
        const expiredInSecond = 3600
        const token = jwtSignWithHashSecret(address, expiredInSecond)
        const rightDecodedToken: DecodedJwtToken | null  = jwtDecodeWithHashSecret(token)
        const wrongDecodedToken: DecodedJwtToken | null = jwtDecodeWithHashSecret('wrong token')
        // test the wrong decoded token
        expect(wrongDecodedToken).toBeNull()
        // test the right decoded token
        //test not null
        expect(rightDecodedToken).not.toBeNull()
        if (rightDecodedToken != null){
            //test address
            expect(rightDecodedToken.address).toBe(address)
            // test expired
            expect(rightDecodedToken.exp - rightDecodedToken.iat).toBe(expiredInSecond)
        }   
    }
    )
}
)