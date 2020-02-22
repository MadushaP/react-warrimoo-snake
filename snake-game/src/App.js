import React, { useState, useEffect, useRef } from 'react';
import Snake from './Snake';
import Food from './Food';
import ScoreBoard from './ScoreBoard';

function App() {
  const [score, setScore] = useState(0);
  const [food, setFood] = useState(randomLocation());
  const [speed, setSpeed] = useState(100);
  const [direction, setDirection] = useState("right")
  const prevDirection = usePrevious(direction);
  const [aiStatus, setAi] = useState(false);

  const [snakeCells, setSnake] = useState([
    [0, 0],
    [2, 0],
    [4, 0],
    [6, 0],
  ]);

  useEffect(() => {
    window.addEventListener('keydown', keypress)
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!aiStatus) {
        tick()
      } else {
        aiTick()
      }
    }, speed);
    return () => clearInterval(interval);
  }, [speed, direction, food, snakeCells]);


  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes

    return ref;
  }
  function randomLocation() {
    let x = Math.floor(Math.random() * 100 / 2) * 2;
    let y = Math.floor(Math.random() * 100 / 2) * 2;
    return [x, y]
  }

  function keypress({ key }) {
    switch (key) {
      case "ArrowRight":
        if (prevDirection.current != "left")
          setDirection("right")
        break
      case "ArrowLeft":
        if (prevDirection.current != "right")
          setDirection("left")
        break
      case "ArrowDown":
        if (prevDirection.current != "up")
          setDirection("down")
        break
      case "ArrowUp":
        if (prevDirection.current != "down")
          setDirection("up")
        break
    }
  }

  function updateBody(snakeCells) {
    let updatedCells = [...snakeCells]

    for (let cell = 0; cell < updatedCells.length - 1; cell++) {
      for (let i = 0; i < 2; i++) {
        updatedCells[cell][i] = snakeCells[cell + 1][i]
      }
    }
    return updatedCells;
  }

  function isArrayInArray(arr, item) {
    var item_as_string = JSON.stringify(item);

    var contains = arr.some(function (ele) {
      return JSON.stringify(ele) === item_as_string;
    });
    return contains;
  }

  function headBodyCollisionCheck(snakeHead) {
    let snakeBody = snakeCells.slice(0, -1)
    if (isArrayInArray(snakeBody, snakeHead)) {
      window.location.reload();
    }
  }

  function outOfBoundsCheck(snakeHead) {
    if (snakeHead[0] > 99 || snakeHead[0] < 0
      || snakeHead[1] < 0 || snakeHead[1] > 99) {
      window.location.reload();
    } else
      return false;
  }

  function hasEatenFood(snakeHead) {
    if (JSON.stringify(snakeHead) === JSON.stringify(food)) {
      return true
    }
    else return false
  }

  function aiGridAligmnet() {
    let snakeHead = snakeCells.slice(-1)[0]

    if (snakeHead[0] > 99) {
      snakeHead[0] -= 2
    } else if (snakeHead[0] < 0) {
      snakeHead[0] += 2
    }
    else if (snakeHead[1] > 99) {
      snakeHead[1] -= 2
    }
    else if (snakeHead[1] < 0) {
      snakeHead[1] += 2
    }
  }

  function aiTick() {
    let updatedCells = updateBody(snakeCells)
    let snakeHead = snakeCells.slice(-1)[0]
    let distanceX = food[0] - snakeHead[0]
    let distanceY = food[1] - snakeHead[1]
    let snakeTail = updatedCells[0]
    console.log(distanceX, distanceY)

    if (distanceX > 0 || distanceY > 0) {
      // console.log("going fowards")
      if (distanceX != 0) {
        snakeHead[0] += 2
      }
      if (distanceY != 0) {
        snakeHead[1] += 2
      }
    }
    else if (distanceX < 0 || distanceY < 0) {
      // console.log("going back")
      if (distanceX != 0) {
        snakeHead[0] -= 2
      }
      if (distanceY != 0) {
        snakeHead[1] -= 2
      }
    }

    aiGridAligmnet(snakeHead)
    outOfBoundsCheck(snakeHead)
    //headBodyCollisionCheck(snakeHead)

    if (hasEatenFood(snakeHead)) {
      setFood(randomLocation())
      setSpeed(speed - 10)
      setScore(score => score + 1)

      updatedCells.unshift([snakeTail[0], snakeTail[1]])
      setSnake(updatedCells)
    } else {
      setSnake(updatedCells)
    }
  }

  function tick() {
    let updatedCells = updateBody(snakeCells)
    let snakeHead = updatedCells.slice(-1)[0]
    let snakeTail = updatedCells[0]

    switch (direction) {
      case "right":
        snakeHead[0] += 2;
        break
      case "left":
        snakeHead[0] -= 2;
        break
      case "down":
        snakeHead[1] += 2;
        break
      case "up":
        snakeHead[1] -= 2;
        break
    }

    outOfBoundsCheck(snakeHead)
    headBodyCollisionCheck(snakeHead)

    if (hasEatenFood(snakeHead)) {
      setFood(randomLocation())
      setSpeed(speed - 10)
      setScore(score => score + 1)

      updatedCells.unshift([snakeTail[0], snakeTail[1]])
      setSnake(updatedCells)
    } else {
      setSnake(updatedCells)
    }
  }

  function setAiStatus() {
    if (aiStatus)
      setAi(false)
    else
      setAi(true)
  }

  return (
    <div className="game-area" >
      <ScoreBoard score={score} setAi={setAiStatus} aiStatus={aiStatus} />
      <Snake snake={snakeCells} />
      <Food food={food} />
    </div>
  );
}

export default App;
