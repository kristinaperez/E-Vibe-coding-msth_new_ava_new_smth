// Старт входа: отправляем на окно авторизации Threads.
const crypto = require('crypto');
const { STATE_COOKIE, setCookie } = require('../../lib/threads');

module.exports = (req, res) => {
  const state = crypto.randomBytes(16).toString('base64url');
  setCookie(res, STATE_COOKIE, state, 600);

  const params = new URLSearchParams({
    client_id: process.env.THREADS_APP_ID || '',
    redirect_uri: process.env.THREADS_REDIRECT_URI || '',
    scope: 'threads_basic',
    response_type: 'code',
    state,
  });
  // Адрес окна входа — проверить по актуальной документации Threads API.
  res.statusCode = 302;
  res.setHeader('Location', `https://threads.net/oauth/authorize?${params.toString()}`);
  res.end();
};
