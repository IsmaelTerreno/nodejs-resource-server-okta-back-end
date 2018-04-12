const OktaJwtVerifier = require('@okta/jwt-verifier');
const resourceServerConfig = require('../.resourceServer.config');
const assertClaimsLocal = resourceServerConfig.resourceServer.assertClaims;
const assertClaimsEnviromentConfig = {
    "aud": process.env.API_URI_OKTA,
    "cid": process.env.CLIEN_ID_OKTA
};
const assertClaims = (process.env.API_URI_OKTA && process.env.CLIEN_ID_OKTA) ?
    assertClaimsEnviromentConfig : assertClaimsLocal;
const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: process.env.WEB_DOMAIN_OAUTH2_OKTA || resourceServerConfig.resourceServer.oidc.issuer,
    assertClaims
});
/**
 * A simple middleware that asserts valid access tokens and sends 401 responses
 * if the token is not present or fails validation.  If the token is valid its
 * contents are attached to req.jwt
 */
function authenticationRequired(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) {
        res.status(401);
        return next('Unauthorized');
    }

    const accessToken = match[1];

    return oktaJwtVerifier.verifyAccessToken(accessToken)
        .then((jwt) => {
            req.jwt = jwt;
            next();
        })
        .catch((err) => {
            res.status(401).send(err.message);
        });
}

module.exports = authenticationRequired;