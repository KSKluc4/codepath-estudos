export const FALAS = {
  inicio: [
    "Bora lá! Eu fico aqui do lado torcendo.",
    "Uma coisa de cada vez. Partiu!",
    "Lição nova, cérebro turbinado. Vamos?",
  ],
  conceito: [
    "Lê com calma, a pergunta vem já já.",
    "Esse pedaço é importante, presta atenção!",
    "Se tiver código, tenta ler linha por linha.",
    "Tô gostando de estudar com você.",
  ],
  pergunta: [
    "Hora de testar! Qual você acha?",
    "Pensa com calma antes de escolher.",
    "Essa você sabe, confia.",
    "Dica: elimina primeiro as que com certeza estão erradas.",
  ],
  montar: [
    "Monta na ordem em que o computador executaria.",
    "Dica: procura a linha que não depende de nenhuma outra.",
  ],
  lacuna: ["Qual pedacinho completa esse código?", "Lê a linha inteira antes de escolher."],
  repeticao: [
    "Essa voltou! Agora você já sabe a pegadinha.",
    "Segunda chance. Lembra da explicação?",
  ],
  acerto: ["Isso aí!", "Mandou bem!", "Exato!", "Na mosca!", "Acertou em cheio!", "Minha chama até cresceu!"],
  combo: [
    "{n} seguidas! Tá voando!",
    "Combo de {n}! Ninguém te segura.",
    "{n} acertos seguidos, que fase!",
  ],
  erro: [
    "Quase! Errar faz parte de aprender.",
    "Tudo bem. Essa pergunta volta no fim pra você tentar de novo.",
    "Respira, lê a explicação e segue.",
  ],
  ultimaVida: ["Última vida! Vai com calma agora.", "Ei, só sobrou uma vida. Lê tudo com atenção."],
  ultimoErro: ["Ih, essa era a última vida. Lê a explicação com calma."],
  semVidas: [
    "Acabaram as vidas, mas o aprendizado ficou. Bora de novo?",
    "Faz parte! Na segunda tentativa vai ser mais fácil.",
  ],
  desafio: [
    "Desafio opcional! Tenta antes de olhar a solução.",
    "Esse não vale vida. É só pra praticar de verdade.",
  ],
  fim: [
    "Lição concluída! Tô orgulhoso de você.",
    "Arrasou! Mais uma pra conta.",
    "Isso que é foco!",
    "Minha cauda não para de balançar!",
  ],
};

export function sortearFala(opcoes: string[], combo = 0): string {
  const fala = opcoes[Math.floor(Math.random() * opcoes.length)];
  return fala.replace("{n}", String(combo));
}
