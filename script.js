const statusEl = document.getElementById("status");
const boardEl = document.getElementById("board");
const restartBtn = document.getElementById("restart");
const cells = Array.from(document.querySelectorAll(".cell"));

const PLAYER = "X";
const AI = "O";
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill(null);
let gameOver = false;

function setStatus(message) {
  statusEl.textContent = message;
}

function checkWinner(state) {
  for (const [a, b, c] of WIN_LINES) {
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return state[a];
    }
  }

  if (state.every(Boolean)) {
    return "draw";
  }

  return null;
}

function render() {
  cells.forEach((cell, index) => {
    cell.textContent = board[index] || "";
    cell.disabled = gameOver || Boolean(board[index]);
  });
}

function minimax(state, currentPlayer) {
  const result = checkWinner(state);
  if (result === AI) return { score: 1 };
  if (result === PLAYER) return { score: -1 };
  if (result === "draw") return { score: 0 };

  const moves = [];

  for (let i = 0; i < state.length; i += 1) {
    if (state[i]) continue;

    const next = [...state];
    next[i] = currentPlayer;

    const simulation = minimax(next, currentPlayer === AI ? PLAYER : AI);
    moves.push({
      index: i,
      score: simulation.score,
    });
  }

  if (currentPlayer === AI) {
    return moves.reduce((best, move) => (move.score > best.score ? move : best));
  }

  return moves.reduce((best, move) => (move.score < best.score ? move : best));
}

function endIfFinished() {
  const result = checkWinner(board);
  if (!result) return false;

  gameOver = true;
  if (result === "draw") {
    setStatus("平手！再來一局？");
  } else if (result === PLAYER) {
    setStatus("你贏了！🎉");
  } else {
    setStatus("電腦贏了！");
  }

  render();
  return true;
}

function aiTurn() {
  if (gameOver) return;

  setStatus("電腦思考中...");

  setTimeout(() => {
    const { index } = minimax(board, AI);
    if (index === undefined) return;

    board[index] = AI;
    render();

    if (!endIfFinished()) {
      setStatus("輪到你下棋");
    }
  }, 250);
}

function handlePlayerMove(index) {
  if (gameOver || board[index]) return;

  board[index] = PLAYER;
  render();

  if (!endIfFinished()) {
    aiTurn();
  }
}

function resetGame() {
  board = Array(9).fill(null);
  gameOver = false;
  setStatus("輪到你下棋");
  render();
}

boardEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  handlePlayerMove(Number(target.dataset.index));
});

restartBtn.addEventListener("click", resetGame);

render();
