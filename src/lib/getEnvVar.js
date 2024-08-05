function getEnvVar(name) {
  const res = process.env[name];

  if (typeof res === 'undefined') {
    throw new Error(`Environment variable '${name}' is not defined`);
  }
  return res;
}

module.exports = { getEnvVar };