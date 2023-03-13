import { SHA256 } from 'crypto-js'

export const getHashedFromCurrentTimestamp = 
(custom: string): string => {
    let result = ''
    const hashSecret: string | undefined = process.env.HASH_SECRET
    if (typeof hashSecret != 'undefined') {
        const currentTimestampString:string = Date.now().toString()
        result = SHA256(currentTimestampString + hashSecret + custom).toString()
    }
    return result
}
