const Cognito = require('aws-sdk/clients/cognitoidentityserviceprovider');

const cognito = (() => {
  if (process.env.STAGE === 'e2e') {
    return new Cognito({
      endpoint: 'http://localstack:4566',
    });
  }
  return new Cognito();
})();

module.exports = {
  cognito,
};