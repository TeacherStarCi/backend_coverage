export type DecodedJwtToken =
    {
        address: string,
        iat: number,
        exp: number
    }

export type VerifiedJwtToken = {
        token: string,
        available : boolean
    }