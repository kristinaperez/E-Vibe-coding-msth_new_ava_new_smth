// Общие помощники для входа через Threads.
// Секреты только из переменных окружения Vercel, в коде их нет.
const crypto = require('crypto');

const SESSION_COOKIE = 'vz_session';
const STATE_COOKIE = 'vz_state';

function parseCookies(header) {
  const out = {};
  (header || '').split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function sign(value) {
  const secret = process.env.SESSION_SECRET || '';
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

// Подписанное значение: base64url(username) + '.' + HMAC.
function makeSession(username) {
  const body = Buffer.from(username, 'utf8').toString('base64url');
  return body + '.' + sign(body);
}

function readSession(value) {
  if (!value || value.indexOf('.') < 0) return null;
  const [body, mac] = value.split('.');
  const expected = sign(body);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return Buffer.from(body, 'base64url').toString('utf8');
}

function setCookie(res, name, value, maxAge) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  res.setHeader('Set-Cookie', [...[].concat(res.getHeader('Set-Cookie') || []), parts.join('; ')]);
}

module.exports = {
  SESSION_COOKIE,
  STATE_COOKIE,
  parseCookies,
  makeSession,
  readSession,
  setCookie,
};
