function logActivity(description, actor = 'nao identificado') {
  const timestamp = new Date().toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium'
  });
  const safeActor = String(actor || 'nao identificado')
    .replace(/[\r\n"\\]/g, ' ')
    .slice(0, 80)
    .trim() || 'nao identificado';

  console.info(`[atividade] ${timestamp} ${safeActor} => ${description}`);
}

module.exports = logActivity;