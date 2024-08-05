const { signIn } =  require('../../lib/signIn');
const { getEnvVar } = require('../../lib/getEnvVar');

// sign user in the new user pool, invokes the migration lambda in the user doesn't exist in the new pool
const handler = async (event) => {
  console.log('event:', JSON.stringify(event, null, 2));

  const payload = JSON.parse(event.body);

  const authResult = await signIn({
    username: payload.email,
    password: payload.password,
    cognitoClient: getEnvVar('END_USER_COGNITO_USER_POOL_CLIENT'),
  });

  return {
    statusCode: 200,
    body: JSON.stringify(authResult),
  };
};

module.exports = {
  main: handler,
}
