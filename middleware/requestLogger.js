function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    if (res.statusCode < 400) {
      return;
    }

    const duration = Date.now() - startedAt;
    console.error(
      `[requisicao][erro] ${new Date().toISOString()} ${req.method} ${req.path} ${res.statusCode} ${duration}ms`
    );
  });

  next();
}

module.exports = requestLogger;