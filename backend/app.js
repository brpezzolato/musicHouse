import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import funcionarioRotas from './routes/funcionariosRotas.js';
import franquiaRotas from './routes/franquiasRotas.js';

dotenv.config();
const app = express();
const porta = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

app.use('/funcionarios', funcionarioRotas);
app.use('/franquias', franquiaRotas);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'online' });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada em:', promise, 'motivo:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Exceção não capturada:', err);
  process.exit(1);
});

const server = app
  .listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
  })
  .on('error', (err) => {
    console.error('Erro ao iniciar:', err);
  });

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Servidor encerrado');
  });
});
