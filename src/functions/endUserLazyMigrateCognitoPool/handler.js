const { cognito } =  require('../../lib/cognito');
const { getEnvVar } = require('../../lib/getEnvVar');
const { signIn } = require('../../lib/signIn');

// migrates user from deprecated cognito pool to v2 cognito pool
const handler = async (event) => {
  console.log('event:', JSON.stringify(event, null, 2));

  const cognitoUsers = await cognito
    .listUsers({
      UserPoolId: getEnvVar('END_USER_COGNITO_USER_POOL_DEPRECATED'),
    })
    .promise();
  const cognitoUser = cognitoUsers.Users?.find((user) => {
    const email = user.Attributes?.find((attr) => attr.Name === 'email');
    return email?.Value === event.userName;
  });
  console.log('cognitoUser:', JSON.stringify(cognitoUser, null, 2));

  if (!cognitoUser || !cognitoUser.Attributes || !cognitoUser.Username) {
    return event;
  }

  const userAttributes = cognitoUser.Attributes.reduce(
    (acc, attr) => {
      if (attr.Value) {
        acc[attr.Name] = attr.Value;
      }
      return acc;
    },
    {},
  );

  const driverUuid = generateCustomId();
  event.response.userAttributes = {
    email: userAttributes.email,
    email_verified: 'true',
    phone_number: userAttributes.phone_number,
    name: userAttributes.name,
    username: driverUuid,
  };

  switch (event.triggerSource) {
    case 'UserMigration_Authentication':
      const signInResponse = await signIn({
        username: event.userName,
        password: event.request.password,
        cognitoClient: getEnvVar('END_USER_COGNITO_USER_POOL_CLIENT_DEPRECATED'),
      });
      console.log('signInResponse:', JSON.stringify(signInResponse, null, 2));

      event.response.finalUserStatus = 'CONFIRMED';
      event.response.messageAction = 'SUPPRESS';
      break;
    case 'UserMigration_ForgotPassword':
      event.response.messageAction = 'SUPPRESS';
      break;
    default:
      throw new Error(`Unhandled triggerSource: ${event.triggerSource}`);
  }

  return event;
};

const generateCustomId = () => {
  return 'custom' + Math.random().toString(36).substring(2);
};

module.exports = {
  main: handler,
}
