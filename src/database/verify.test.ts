import { addVerify, checkVerifyToken, setVerifyAvailable } from './verify'
describe('verify model test', () => {
    test('To add verify function test', async () => {
        const token = 'starcidaphilosopher' + Date.now().toString()
        // add new token
        expect(await addVerify(token)).toBeTruthy()
        // add duplicated token
        expect(await addVerify(token)).toBeFalsy()
    })
    test('To check verify token function test', async () => {
        const rightAvailableToken = '06066a7288105031ab25e2005ff607d27c6f2c0cd935831725d95e4f0cc967e6'
        const rightUnavailableToken = 'starci'
        const wrongToken = 'wrong token'
        // check right token
        //case available = true
        expect(await checkVerifyToken(rightAvailableToken)).toBeTruthy()
        //case available = false
        expect(await checkVerifyToken(rightUnavailableToken)).toBeFalsy()
        // check wrong token
        expect(await addVerify(wrongToken)).toBeFalsy()
    })
    test('To set verify function test', async () => {
        const token = 'starci'
        const wrongToken = 'wrong token'
        // set a false token to true
        expect(await setVerifyAvailable(token, true)).toBeTruthy()
        // set a true token to false
        expect(await setVerifyAvailable(token, false)).toBeTruthy()
        // a wrong token??
        expect(await setVerifyAvailable(wrongToken, true)).toBeFalsy()
    })
}
)