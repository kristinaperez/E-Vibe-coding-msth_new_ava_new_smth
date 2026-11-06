// Возврат из Threads: меняем код на токен, читаем имя пользователя и ставим подписанную cookie.
// Токен не сохраняем и не логируем.
const {
  SESSION_COOKIE,
  STATE_COOKIE,
  parseCookies,
  makeSession,
  setCookie,
} = require('../../lib/threads');

function fail(res) {
  res.statusCode = 302;
  res.setHeader('Location', '/?threads=error');
  res.end();
}

module.exports = async (req, res) => {
  const url = new URL(req.url, 'https://placeholder.local');
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookies = parseCookies(req.headers.cookie);

  if (!code || !state || state !== cookies[STATE_COOKIE]) return fail(res);

  try {
    // Обмен кода на токен (POST, form). Эндпоинты — проверить по актуальной документации.
    const tokenRes = await fetch('https://graph.threads.net/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.THREADS_APP_ID || '',
        client_secret: process.env.THREADS_APP_SECRET || '',
        grant_type: 'authorization_code',
        redirect_uri: process.env.THREADS_REDIRECT_URI || '',
        code,
      }),
    });
    if (!tokenRes.ok) return fail(res);
    const { access_token: token } = await tokenRes.json();

    const profileRes = await fetch(
      `https://graph.threads.net/v1.0/me?fields=id,username&access_token=${encodeURIComponent(token)}`
    );
    if (!profileRes.ok) return fail(res);
    const profile = await profileRes.json();
    if (!profile.username) return fail(res);

    setCookie(res, STATE_COOKIE, '', 0);
    setCookie(res, SESSION_COOKIE, makeSession(profile.username), 60 * 60 * 24 * 30);
    res.statusCode = 302;
    res.setHeader('Location', '/?threads=ok');
    res.end();
  } catch (e) {
    fail(res);
  }
};
