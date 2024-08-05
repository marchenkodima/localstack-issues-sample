module.exports = {
  handler: `./src/functions/signIn/handler.main`,
  name: '${self:custom.stackName}--end-user-sign-in',
  events: [
    {
      http: {
        method: 'post',
        path: '/sign-in',
      },
    },
  ],
};
