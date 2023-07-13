let start = () => alert("Press 'Enter' to start the game");

let board;
let interval;

let points = 0;
let speed = 150;
let key = "ArrowRight";

let space = true;

let moves = {
  ArrowLeft: {
    x: -1,
    y: 0,
    body:13,
    invalid: "ArrowRight"
  },

  ArrowRight: {
    x: 1,
    y: 0,
    body: 14,
    invalid: "ArrowLeft"
  },

  ArrowUp: {
    x: 0,
    y: -1,
    body: 15,
    invalid: "ArrowDown"
  },

  ArrowDown: {
    x: 0,
    y: 1,
    body: 16,
    invalid: "ArrowUp"
  },
};

let food = {
  x: 15,
  y: 15
};

let headPosition = {
  x: 3,
  y: 3
};

let snake = [
  {
    body: 14,
    name: "head",
    x: 3,
    y: 3
  },
  {
    body: 3,
    name: "tail",
    x: 2,
    y: 3
  }
];

let pieces = {
  0: "background-green.png",
  1: "apple.png",
  2: "border.png",
  3: "tail_left.png",
  4: "tail_right.png",
  5: "tail_up.png",
  6: "tail_down.png",
  7: "body_bottomleft.png",
  8: "body_bottomright.png",
  9: "body_topleft.png",
  10: "body_topright.png",
  11: "body_horizontal.png",
  12: "body_vertical.png",
  13: "head_left.png",
  14: "head_right.png",
  15: "head_up.png",
  16: "head_down.png"
};

function show() {
  board = Array.from({length: 20}, (e, i1) => 
    Array.from({length: 20}, (e, i2) => 
      (i1 > 0 && i1 < 19 && i2 > 0 && i2 < 19)? 0 : 2
    )
  );

  board[food.y][food.x] = 1;
  snake.forEach(e => board[e.y][e.x] = e.body);
  document.getElementById("board").innerHTML = board.flat().map(e => `<img src="./src/img/${pieces[e]}">`).join('');
}

function move() {
  headPosition.x += (moves[key]?.x || 0);
  headPosition.y += (moves[key]?.y || 0);
  
  if(board[headPosition.y][headPosition.x] > 1) {
    return gameOver();
  }
  snake.unshift({
    x: headPosition.x,
    y: headPosition.y,
    body: moves[key]?.body
  });

  bodyPosition();
}

function gameOver() {
  window.clearInterval(interval);
  alert("Game Over");
  window.location.reload();
}

function bodyPosition() {
  if(snake.length > 2) {
    let x = snake[0].x - snake[2].x;
    let y = snake[0].y - snake[2].y;

    if(x == 0) {
      snake[1].body = 12;
    } else if(y == 0) {
      snake[1].body = 11;
    } else if(x > 0) {
      if(snake[1].y > snake[2].y) {
        snake[1].body = 10;
      } else if(snake[1].y < snake[2].y) {
        snake[1].body = 8;
      } else {
        if(snake[1].y > snake[0].y) {
          snake[1].body = 9;
        } else {
          snake[1].body = 7;
        }
      }
    } else {
      if(snake[1].y > snake[2].y) {
        snake[1].body = 9;
      } else if(snake[1].y < snake[2].y) {
        snake[1].body = 7;
      } else {
        if(snake[1].y > snake[0].y) {
          snake[1].body = 10;
        } else {
          snake[1].body = 8;
        }
      }
    }
  }
  eatFood();
}

function eatFood() {
  if(board[headPosition.y][headPosition.x] == 1) {
    document.getElementById("points").innerHTML = ++points;
    while (board[food.y][food.x] != 0) {
      food.x = parseInt(Math.random() * 18) + 1;
      food.y = parseInt(Math.random() * 18) + 1;
    }
    speedBoost();
    window.clearInterval(interval);
    interval = window.setInterval(move, parseInt(speed));

  } else {
    snake.pop();
  }
  tailPosition();
}

function speedBoost() {
  if(snake.length < 10) {
    speed *= 0.97;
  } else if(snake.length < 20) {
    speed *= 0.98;
  } else {
    speed *= 0.99;
  }
}

function tailPosition() {
  let snakeLen = snake.length;
  if(snakeLen > 1) {
    let x = snake[snakeLen - 1].x - snake[snakeLen - 2].x;
    let y = snake[snakeLen - 1].y - snake[snakeLen - 2].y;

    if(x > 0) {
      snake[snakeLen - 1].body = 4;
    } else if(x < 0) {
      snake[snakeLen - 1].body = 3;
    } else if(y > 0) {
      snake[snakeLen - 1].body = 6;
    } else {
      snake[snakeLen - 1].body = 5;
    }
  }
  show();
}

function setKey(e) {
  pause(e);
  if(space) {
    if(moves[e.key] && moves[key].invalid != e.key) {
      key = e.key;
    } 
  }
}

function pause(e) {
  if(e.code == "Space") {
    space = !space;
    if(space) {
      interval = window.setInterval(move, speed);
    } else {
      window.clearInterval(interval);
    }
  }
}

function textFlash() {
  let getText = document.querySelectorAll("p");
  getText.forEach(e => {
    if(e.innerHTML == "Press \"Space\" to pause") {
      e.innerHTML = '';
    } else {
      e.innerHTML = "Press \"Space\" to pause";
    }
  });
}

window.setInterval(textFlash, 700);

document.addEventListener("keydown", setKey);
show();
interval = window.setInterval(move, speed);