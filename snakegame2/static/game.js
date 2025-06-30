/* snake-multi-food.js */
const canvas = document.getElementById('game');
const ctx   = canvas.getContext('2d');

const box = 20;
let snake = [{ x: 200, y: 200 }];
let foods = generateFoods(3);          // ← how many food items you want

let dx = box, dy = 0;
let timer = null;

let score     = 0;
let highScore = +localStorage.getItem('highScore') || 0;
document.getElementById('high-score').textContent = highScore;

// ───────────────────────── helpers ──────────────────────────
function randomFood() {
  let f;
  do {
    f = {
      x: Math.floor(Math.random() * (canvas.width  / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
  } while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
}

function generateFoods(n) {
  return Array.from({ length: n }, randomFood);
}

// ───────────────────────── input ──────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp'    && dy === 0) [dx, dy] = [0, -box];
  if (e.key === 'ArrowDown'  && dy === 0) [dx, dy] = [0,  box];
  if (e.key === 'ArrowLeft'  && dx === 0) [dx, dy] = [-box, 0];
  if (e.key === 'ArrowRight' && dx === 0) [dx, dy] = [ box, 0];
});

// ───────────────────────── drawing ─────────────────────────
function drawFoods() {
  ctx.fillStyle = 'red';
  for (const f of foods) ctx.fillRect(f.x, f.y, box, box);
}

function drawSnake() {
  ctx.fillStyle = 'green';
  for (const s of snake) ctx.fillRect(s.x, s.y, box, box);
}

// ───────────────────────── game loop ───────────────────────
function step() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFoods();
  drawSnake();

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // eat?
  for (let i = 0; i < foods.length; i++) {
    if (head.x === foods[i].x && head.y === foods[i].y) {
      foods[i] = randomFood();
      snake.unshift(head);          // grow
      score++;
      document.getElementById('score').textContent = score;

      if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('high-score').textContent = highScore;
      }
      return;                       // skip tail-removal when eating
    }
  }

  // collision?
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    clearInterval(timer);
    document.getElementById('restart-btn').style.display = 'inline';
    return;
  }

  // normal move
  snake.pop();
  snake.unshift(head);
}

// ───────────────────────── controls ────────────────────────
document.getElementById('speed-form').addEventListener('submit', e => {
  e.preventDefault();
  const speed = +document.getElementById('speed').value;
  timer = setInterval(step, speed);
  e.target.style.display = 'none';
});

document.getElementById('restart-btn').addEventListener('click', () => {
  snake = [{ x: 200, y: 200 }];
  foods = generateFoods(3);
  dx = box; dy = 0;
  score = 0;
  document.getElementById('score').textContent = score;
  document.getElementById('restart-btn').style.display = 'none';

  const speed = +document.getElementById('speed').value;
  timer = setInterval(step, speed);
});
