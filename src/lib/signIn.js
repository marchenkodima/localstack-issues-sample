const { cognito } = require('./cognito');

async function signIn({
  username,
  password,
  cognitoClient,
}) {
  const auth = await cognito
    .initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: cognitoClient,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    })
    .promise()
    .catch((e) => {
      if (e.name === 'NotAuthorizedException' || e.name === 'UserNotFoundException') {
        throw new Error('Invalid email or password');
      }
      throw e;
    });

  if (auth.ChallengeName) {
    return {
      tokens: undefined,
      challengeName: auth.ChallengeName,
    };
  }

  if (!auth.AuthenticationResult) {
    throw new Error('AuthenticationResult not present in initiateAuth response');
  }

  if (!auth.AuthenticationResult.AccessToken) {
    throw new Error('Access token not present in initiateAuth response');
  }

  if (!auth.AuthenticationResult.RefreshToken) {
    throw new Error('Refresh token not present in initiateAuth response');
  }

  if (!auth.AuthenticationResult.IdToken) {
    throw new Error('ID token not present in initiateAuth response');
  }

  if (!auth.AuthenticationResult.ExpiresIn) {
    throw new Error('ExpiresIn not present in initiateAuth response');
  }

  return {
    challengeName: undefined,
    tokens: {
      access: auth.AuthenticationResult.AccessToken,
      refresh: auth.AuthenticationResult.RefreshToken,
      id: auth.AuthenticationResult.IdToken,
      expiresIn: auth.AuthenticationResult.ExpiresIn,
    },
  };
}

module.exports = {
  signIn,
};
