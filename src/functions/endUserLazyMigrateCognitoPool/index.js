module.exports = {
  handler: `./src/functions/endUserLazyMigrateCognitoPool/handler.main`,
  name: '${self:custom.stackName}--end-user-lazy-migrate-cognito-pool',
  events: [
    {
      cognitoUserPool: {
        pool: '${self:custom.stackName}--EndUserCognitoUserPoolV2',
        trigger: 'UserMigration',
        existing: true,
      },
    },
  ],
};
