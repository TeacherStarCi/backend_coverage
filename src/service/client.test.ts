
import {getCosmWasmWalletAndClient, getStargateWalletAndClient} from './client'

describe('Client service tests', () => {
    test('To get cosm wasm wallet and client function test', async () => {
        //test wallet and client get
        expect((await getCosmWasmWalletAndClient()).wallet).not.toBeUndefined()
        expect((await getCosmWasmWalletAndClient()).client).not.toBeUndefined()
    }
    )
    test('To get stargate wallet and client function test', async () => {
        //test wallet and client get
        expect((await getStargateWalletAndClient()).wallet).not.toBeUndefined()
        expect((await getStargateWalletAndClient()).client).not.toBeUndefined()
    }
    )

})