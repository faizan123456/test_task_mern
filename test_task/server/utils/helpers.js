const ENV_ENUM = { TEST: 'TESTING', PROD: 'PRODUCTION', DEV: 'DEVELOPMENT' };
const isEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const arraySplitter = (arr, size, out) => {
  out = out || [];
  if (!arr.length) return out;
  out.push(arr.slice(0, size));
  return arraySplitter(arr.slice(size), size, out);
};

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = {
  ENV_ENUM,
  isEmail,
  arraySplitter,
  isJson,
};
