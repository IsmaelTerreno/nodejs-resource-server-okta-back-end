const oktaSdk = require('@okta/okta-sdk-nodejs');
const oktaClientConfig = require('../.okta.client.config');
const apiClient = new oktaSdk.Client({
    orgUrl: process.env.ORG_URL_OKTA || oktaClientConfig.orgUrl,
    token: process.env.TOKEN_OKTA || oktaClientConfig.token
});

module.exports = apiClient;