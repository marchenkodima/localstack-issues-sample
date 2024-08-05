module.exports = {
  handler: `./src/functions/createEndUser/handler.main`,
  name: '${self:custom.stackName}--end-user-create',
  events: [
    {
      http: {
        method: 'post',
        path: '/create-end-user',
      },
    },
  ],
};
