// Variáveis do jogo
let jogador;
let produtos = [];
let barraca;
let pontuacao = 0;
let obstaculos = [];
let chegouNaFeria = false;
let tempoExibicaoMensagem = 0;
const DURACAO_MENSAGEM = 6000; // 6 segundos

// Variáveis para efeitos visuais
let efeitoProdutoColetado = []; // Para explosão de produtos coletados
let efeitoColisao = []; // Para efeito de colisão com obstáculos

// Emojis para elementos do jogo
const EMOJI_JOGADOR = "🧑‍🌾"; // Fazendeiro
const EMOJI_BARRACA = "🎪"; // Tenda de feira
const EMOJI_OBSTACULO = "🪨"; // Pedra

// Emojis para os produtos
const EMOJIS_PRODUTOS = {
  macaco: "🍎", // Maçã
  cenoura: "🥕", // Cenoura
  uvas: "🍇", // Uvas
  milho: "🌽", // Milho
  banana: "🍌", // Banana
  morango: "🍓", // Morango
  brocolos: "🥦", // Brócolis
  abobora: "🎃", // Abóbora
};

function setup() {
  createCanvas(800, 600);
  jogador = createVector(100, 500); // Posição inicial do jogador
  barraca = createVector(700, 100); // Posição da barraca
  gerarProdutos(); // Gera os produtos iniciais
  gerarObstaculos(); // Gera os obstáculos iniciais
  textFont("Arial", 24); // Define uma fonte padrão para texto
  textAlign(CENTER, CENTER); // Alinha o texto ao centro
}

function draw() {
  desenharCenario(); // Desenha o cenário (agora com cores)
  desenharBarraca(); // Desenha a barraca (agora com emoji)
  moverJogador(); // Move o jogador
  desenharJogador(); // Desenha o jogador (agora com emoji)
  verificarProdutos(); // Verifica e desenha produtos, além de colisões
  desenharObstaculos(); // Desenha obstáculos e verifica colisões
  exibirPontuacao(); // Exibe a pontuação
  verificarChegadaNaFeria(); // Verifica se o jogador chegou na feira e exibe mensagem

  // Atualiza e desenha efeitos visuais
  desenharEfeitos();
}

// Desenha o cenário com cores em vez de imagens
function desenharCenario() {
  // Parte superior do cenário (cidade)
  background(173, 216, 230); // Azul claro para o céu

  // Desenha alguns "prédios" simples na cidade
  fill(120, 120, 120);
  rect(50, 0, 80, 200);
  rect(150, 50, 60, 150);
  rect(250, 0, 100, 250);
  rect(380, 70, 70, 180);
  rect(500, 0, 90, 220);
  rect(620, 40, 80, 160);
  rect(730, 0, 70, 200);

  // Parte inferior do cenário (campo)
  fill(144, 238, 144); // Verde claro para o campo
  rect(0, height / 2, width, height / 2);

  // Linha do horizonte para separar cidade e campo
  stroke(100);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);
  noStroke(); // Remove o contorno padrão
}

// Desenha a barraca com um emoji e texto estilizado
function desenharBarraca() {
  let bx = barraca.x;
  let by = barraca.y;
  let tamanhoBarraca = 80; // Tamanho do emoji da barraca

  // Desenha o emoji da barraca
  textSize(tamanhoBarraca);
  text(EMOJI_BARRACA, bx + tamanhoBarraca / 2, by + tamanhoBarraca / 2);

  // Adiciona uma "tampa" de barraca com cor
  fill(180, 0, 0); // Vermelho escuro
  triangle(bx - 10, by + 10, bx + tamanhoBarraca + 10, by + 10, bx + tamanhoBarraca / 2, by - 30);
  fill(255); // Branco para as listras
  rect(bx - 10, by + 10, tamanhoBarraca + 20, 10); // Base da barraca

  // Texto "Feira" estilizado
  fill(255); // Branco
  textSize(20);
  textFont('Georgia');
  textAlign(CENTER);
  text("Feira da Cidade", bx + tamanhoBarraca / 2, by + tamanhoBarraca + 25);
}

// Desenha o jogador com um emoji e animação sutil
let frameJogador = 0;
let velocidadeAnimacaoJogador = 0.1;

function desenharJogador() {
  let px = jogador.x;
  let py = jogador.y;
  let tamanhoJogador = 50; // Tamanho do emoji do jogador

  // Animação de "caminhada" sutil (apenas para o desenho)
  frameJogador += velocidadeAnimacaoJogador;
  if (frameJogador > 2 * PI) {
    frameJogador = 0;
  }
  // Calcula um deslocamento Y para o efeito de "flutuação" sutil
  let deslocamentoY = sin(frameJogador * 2) * 0.5;

  // Desenha o emoji do jogador com o deslocamento visual
  textSize(tamanhoJogador);
  text(EMOJI_JOGADOR, px + tamanhoJogador / 2, py + tamanhoJogador / 2 + deslocamentoY);

  // Adiciona uma sombra sutil ao jogador
  fill(0, 0, 0, 50);
  ellipse(px + tamanhoJogador / 2, py + tamanhoJogador - 5 + deslocamentoY, tamanhoJogador * 0.7, 10);
}

// Move o jogador com base nas teclas pressionadas
function moverJogador() {
  if (keyIsDown(LEFT_ARROW)) jogador.x -= 5;
  if (keyIsDown(RIGHT_ARROW)) jogador.x += 5;
  if (keyIsDown(UP_ARROW)) jogador.y -= 5;
  if (keyIsDown(DOWN_ARROW)) jogador.y += 5;

  // Limita o jogador dentro dos limites da tela
  jogador.x = constrain(jogador.x, 0, width - 50); // Ajuste para o novo tamanho do jogador
  jogador.y = constrain(jogador.y, 0, height - 50);
}

// Gera novos produtos aleatoriamente no campo
function gerarProdutos() {
  const tiposProdutos = Object.keys(EMOJIS_PRODUTOS); // Obtém os tipos de produtos dos emojis
  for (let i = 0; i < 8; i++) { // Gera 8 produtos
    let x = random(50, 750);
    let y = random(350, 550); // Posição no campo
    let tipo = random(tiposProdutos); // Seleciona um tipo de produto aleatório
    produtos.push({ pos: createVector(x, y), tipo: tipo, coletado: false }); // Adiciona 'coletado' flag
  }
}

// Verifica colisões com produtos e os desenha
function verificarProdutos() {
  for (let i = produtos.length - 1; i >= 0; i--) {
    let p = produtos[i];
    if (!p.coletado) { // Só desenha se não foi coletado ainda
      desenharProduto(p.pos.x, p.pos.y, p.tipo);
    }

    // Verifica a distância de colisão entre o jogador e o produto
    if (dist(jogador.x + 25, jogador.y + 25, p.pos.x + 15, p.pos.y + 15) < 40 && !p.coletado) {
      p.coletado = true; // Marca como coletado
      pontuacao++; // Aumenta a pontuação
      efeitoProdutoColetado.push(new EfeitoColeta(p.pos.x, p.pos.y)); // Adiciona efeito de coleta
    }
  }

  // Remove produtos coletados da lista, garantindo que o efeito de coleta tenha tempo para aparecer
  // Este é um método simplificado; num jogo maior, gerir-se-ia com base no estado do efeito.
  produtos = produtos.filter(p => !p.coletado);

  // Garante que novos produtos apareçam se o número for baixo
  if (produtos.length < 5) {
    gerarProdutos();
  }
}

// Desenha cada tipo de produto usando seu emoji correspondente
function desenharProduto(x, y, tipo) {
  let emoji = EMOJIS_PRODUTOS[tipo]; // Obtém o emoji com base no tipo
  textSize(30); // Tamanho do emoji do produto
  text(emoji, x + 15, y + 15); // Desenha o emoji
}

// Gera novos obstáculos aleatoriamente
function gerarObstaculos() {
  obstaculos = []; // Limpa obstáculos existentes antes de gerar novos
  for (let i = 0; i < 10; i++) { // Gera 10 obstáculos
    let x = random(50, 750);
    let y = random(150, 500); // Evita gerar perto da barraca ou muito próximo do jogador
    obstaculos.push(createVector(x, y));
  }
}

// Desenha obstáculos e verifica colisões com o jogador
function desenharObstaculos() {
  for (let obs of obstaculos) {
    textSize(40); // Tamanho do emoji do obstáculo
    text(EMOJI_OBSTACULO, obs.x + 20, obs.y + 20); // Desenha emoji do obstáculo

    // Verifica a distância de colisão entre o jogador e o obstáculo
    if (dist(jogador.x + 25, jogador.y + 25, obs.x + 20, obs.y + 20) < 40) {
      pontuacao = max(0, pontuacao - 1); // Reduz a pontuação (mínimo 0)
      jogador.set(100, 500); // Reseta a posição do jogador após colisão
      efeitoColisao.push(new EfeitoColisao(jogador.x + 25, jogador.y + 25)); // Adiciona efeito de colisão
    }
  }
}

// Exibe a pontuação na tela
function exibirPontuacao() {
  fill(255); // Cor branca para o texto
  textSize(28); // Aumenta o tamanho
  textFont('Arial Black'); // Uma fonte mais impactante
  textAlign(LEFT);
  // Adiciona uma sombra ao texto
  fill(0, 0, 0, 150); // Sombra preta semi-transparente
  text("Produtos entregues: " + pontuacao, 13, 33);
  fill(255); // Texto branco
  text("Produtos entregues: " + pontuacao, 10, 30);
}

// Verifica se o jogador chegou na feira e exibe uma mensagem
function verificarChegadaNaFeria() {
  let distanciaParaBarraca = dist(jogador.x + 25, jogador.y + 25, barraca.x + 40, barraca.y + 40);

  if (distanciaParaBarraca < 80) { // Aumenta a área de deteção
    if (!chegouNaFeria) {
      chegouNaFeria = true;
      tempoExibicaoMensagem = millis() + DURACAO_MENSAGEM;
    }
  } else {
    chegouNaFeria = false;
  }

  if (tempoExibicaoMensagem > millis()) {
    // Efeito de desfoque no fundo para focar na mensagem (simulado com um filtro opaco)
    // filter(BLUR, 3); // O desfoque do p5.js pode ser pesado, vamos simular com uma camada translúcida
    
    // Fundo semi-transparente para a mensagem
    fill(0, 0, 0, 150); // Preto semi-transparente
    rect(0, 0, width, height);

    // Fundo com gradiente suave para a caixa de mensagem
    let alfa = map(millis(), tempoExibicaoMensagem - DURACAO_MENSAGEM, tempoExibicaoMensagem, 0, 200);
    for (let i = 0; i < 200; i++) {
      let inter = map(i, 0, 199, 0, 1);
      let c1 = color(50, 100, 150, alfa); // Azul escuro
      let c2 = color(100, 150, 200, alfa); // Azul claro
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(width / 2 - 300, height / 2 - 100 + i, width / 2 + 300, height / 2 - 100 + i);
    }
    noStroke();

    // Moldura decorativa
    fill(255, 255, 255, 150); // Branco semi-transparente
    rect(width / 2 - 305, height / 2 - 105, 610, 210, 25); // Borda arredondada

    // Título animado
    fill(255, 220, 0); // Amarelo vibrante
    textSize(36 + sin(millis() * 0.005) * 5); // Pulsando
    textFont('Impact');
    textAlign(CENTER);
    text("Bem-vindo à Feira!", width / 2, height / 2 - 60);

    // Mensagens secundárias
    fill(255);
    textSize(20);
    textFont('Verdana');
    text("Você veio do campo, cheio de produtos frescos!", width / 2, height / 2 - 10);
    text("A cidade aguarda as suas delícias!", width / 2, height / 2 + 30);
    text("Continue a coletar produtos!", width / 2, height / 2 + 70);
  }
}

// Classe para o efeito de coleta de produtos
class EfeitoColeta {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particulas = [];
    for (let i = 0; i < 10; i++) {
      this.particulas.push({
        x: x,
        y: y,
        vx: random(-2, 2),
        vy: random(-2, 2),
        alfa: 255,
        tamanho: random(5, 10)
      });
    }
  }

  update() {
    for (let p of this.particulas) {
      p.x += p.vx;
      p.y += p.vy;
      p.alfa -= 5; // Desaparece
      p.tamanho *= 0.95; // Diminui
    }
    this.particulas = this.particulas.filter(p => p.alfa > 0); // Remove partículas invisíveis
  }

  draw() {
    for (let p of this.particulas) {
      fill(255, 255, 0, p.alfa); // Amarelo para brilho de coleta
      ellipse(p.x, p.y, p.tamanho, p.tamanho);
    }
  }

  estaTerminado() {
    return this.particulas.length === 0;
  }
}

// Classe para o efeito de colisão com obstáculos
class EfeitoColisao {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particulas = [];
    for (let i = 0; i < 15; i++) {
      this.particulas.push({
        x: x,
        y: y,
        vx: random(-3, 3),
        vy: random(-3, 3),
        alfa: 255,
        tamanho: random(8, 15)
      });
    }
  }

  update() {
    for (let p of this.particulas) {
      p.x += p.vx;
      p.y += p.vy;
      p.alfa -= 8; // Desaparece mais rápido
      p.tamanho *= 0.9; // Diminui mais rápido
    }
    this.particulas = this.particulas.filter(p => p.alfa > 0); // Remove partículas invisíveis
  }

  draw() {
    for (let p of this.particulas) {
      fill(255, 0, 0, p.alfa); // Vermelho para colisão
      ellipse(p.x, p.y, p.tamanho, p.tamanho);
    }
  }

  estaTerminado() {
    return this.particulas.length === 0;
  }
}

// Função para desenhar todos os efeitos ativos
function desenharEfeitos() {
  for (let i = efeitoProdutoColetado.length - 1; i >= 0; i--) {
    efeitoProdutoColetado[i].update();
    efeitoProdutoColetado[i].draw();
    if (efeitoProdutoColetado[i].estaTerminado()) {
      efeitoProdutoColetado.splice(i, 1);
    }
  }
  for (let i = efeitoColisao.length - 1; i >= 0; i--) {
    efeitoColisao[i].update();
    efeitoColisao[i].draw();
    if (efeitoColisao[i].estaTerminado()) {
      efeitoColisao.splice(i, 1);
    }
  }
}