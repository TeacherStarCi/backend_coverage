import jwt, { JwtPayload } from 'jsonwebtoken'
import { DecodedJwtToken } from '../type'

export const jwtSignWithHashSecret =
  (address: string, expiredInSecond: number): string => {
      let result = ''
      const hashSecret: string | undefined = process.env.HASH_SECRET
      if (typeof hashSecret != 'undefined') {
          const payload = { address: address }
          result = jwt.sign(payload, hashSecret, { expiresIn: expiredInSecond })
      }
      return result
  }

export const jwtDecodeWithHashSecret =
  (token: string) => {
      let result: DecodedJwtToken | null = null
      let verifiedResult: JwtPayload | string = ''
      const hashSecret: string | undefined = process.env.HASH_SECRET
      if (typeof hashSecret != 'undefined') {
          try {
              verifiedResult = jwt.verify(token, hashSecret)
          } catch (err: unknown) {
              // no catch needed
          }
      }
      if (typeof verifiedResult != 'string') {
          result = {
              address: verifiedResult.address,
              iat: verifiedResult.iat,
              exp: verifiedResult.exp
          }
      }
      return result
  }