// Отдаёт имя пользователя Threads из подписанной cookie (без обращения к API Threads).
const { SESSION_COOKIE, parseCookies, readSession } = require('../../lib/threads');

module.exports = (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const username = readSession(cookies[SESSION_COOKIE]);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  if (!username) {
    res.statusCode = 401;
    res.end(JSON.stringify({ username: null }));
    return;
  }
  res.end(JSON.stringify({ username }));
};
