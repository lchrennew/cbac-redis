import * as keys from './redis-keys.js'
import { redis } from "../utils/redis.js";
import { getClaimSha256sByAliases } from "./aliases.js";

const getClaims = async (...sha256s) => {
    return sha256s?.length ? await redis.hmget(keys.validatorClaims(), ...sha256s) : [];
}

export const getClaimsByAlias = async (...aliases) => {
    const sha256s = await getClaimSha256sByAliases(...aliases)
    return getClaims(...sha256s)
}

export const createClaim = claim => {
    if (!claim) return
    const content = JSON.stringify(claim)
    const sha256 = keys.claimSha256(content);
    redis.hsetnx(keys.validatorClaims(), sha256, content);
    return sha256
}


