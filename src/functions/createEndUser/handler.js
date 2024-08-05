const { cognito } =  require('../../lib/cognito');
const { getEnvVar } = require('../../lib/getEnvVar');

// creates a user in old cognito user pool to later test the migration lambda
const handler = async (event) => {
  console.log('event:', JSON.stringify(event, null, 2));

  const payload = JSON.parse(event.body);

  const user = await cognito.adminCreateUser({
    UserPoolId: getEnvVar('END_USER_COGNITO_USER_POOL_DEPRECATED'),
    Username: payload.email,
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      {
        Name: 'email',
        Value: payload.email,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
      {
        Name: 'phone_number',
        Value: payload.phone_number,
      },
      {
        Name: 'name',
        Value: payload.name,
      },
    ],
  }).promise();
  await cognito.adminSetUserPassword({
    UserPoolId: getEnvVar('END_USER_COGNITO_USER_POOL_DEPRECATED'),
    Username: payload.email,
    Password: payload.password,
    Permanent: true,
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};

module.exports = {
  main: handler,
}
