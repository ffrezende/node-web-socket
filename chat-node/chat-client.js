const socket = require('socket.io-client')('http://localhost:3000');
const repl = require('repl');
const chalk = require('chalk');
const readline = require('readline');
let username = '';

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

perguntar = pergunta =>
  new Promise(resolver =>
    input.question(pergunta, resposta => {
      resolver(resposta);
      input.close();
    })
  );

WebSocket = () => {
  socket.on('disconnect', () => {
    socket.emit('disconnect');
  });

  socket.on('connect', async () => {
    console.log(chalk.red('=== start chatting ==='));
    username = await perguntar('Digite seu nick: ');
    await readInput();
  });

  socket.on('message', data => {
    const { cmd, username } = data;
    console.log(chalk.green(username + ': ' + cmd.split('\n')[0]));
  });
};

readInput = async () => {
  repl.start({
    prompt: '',
    eval: cmd => {
      socket.send({ cmd, username });
    }
  });
};

WebSocket();
