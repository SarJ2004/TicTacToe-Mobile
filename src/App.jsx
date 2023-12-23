import { useState } from "react";

//we will use props to pass the value each square should have from the parent component(board) to the child component(Square)
// we will have to update the square component to read the value prop that we will pass to the board
//we removed the value prop later in development, since we wanted to respond to clicks, and we started using a useState for updation of  value
const Square = ({ value, onSquareClick }) => {
  // const [value, setValue] = useState(null);
  // value stores the value, and setValue is used to update the value
  // initial value for the value state variable is null
  //by calling this set function, we are telling react to re render that square whenever button is clicked, after upadation, the value of square will be X
  // each square will have its own state. the value stored in each sqare is completelly independent of the others
  // To check for a winner in a tic-tac-toe game, the Board would need to somehow know the state of each of the 9 Square components.
  //To collect data from multiple children, or to have two child components communicate with each other, declare the shared state in their parent component instead. The parent component can pass that state back down to the children via props. This keeps the child components in sync with each other and with their parent.
  // function handleClick() {
  //   setValue("X");
  // }
  //since every square will  have its own response to being clicked, we have to pass the onSquareClick function as a prop to the Square Component.
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
};
//we have now made the board component fully controlled by the props to it by the Game component.
function Board({ xIsNext, squares, onPlay }) {
  //parent component
  // const [squares, setSquares] = useState(Array(9).fill(null));
  //declaring a squares state variable
  //initializing an empty array of size 9 using the array constructor, and filling all the boxes with null
  //Now our Board component needs to pass the value prop down to each Square that it renders:
  // const [xIsNext, setXIsNext] = useState(true);
  //setting the first move as X by default
  //each time a player moves, xIsNext will be flipped to determine which player has to go next
  //we have to add this logic to the handleClick function
  //Each Square will now receive a value prop that will either be 'X', 'O', or null for empty squares.
  // we will connect the onSquareClick prop to a function in the Board coomponent that we will name handleClick

  function handleClick(i) {
    //js supports closures, which means JS has access to all the variables of the outer function and variables(here, squares)
    if (squares[i] || findWinner(squares)) {
      return; //if the ith square already has something in it, or if there is a winner, return the function.
      //which means the rest of the code below wont execute
      //this will allow us  to add X or O's to empty squares only
    }
    const nextSquares = squares.slice();
    //creating the copy of the squares array(nextSquares) with the JS slice() array method
    // nextSquares[i] = "X";
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    // setSquares(nextSquares);
    //now the state of component has been changed and set to nextSquares(with first element as "X")
    //This will trigger a re-render of the components that use the squares state(board), as well as its child components(square)
    //we created a copy of the squares array because immutability is important in react. it helps us to implement the ability of undo-redo, which is a common requirement for apps, by keeping the track of previous versions of data. Also, we should try avoid re-rendering parts of the tree which was crearly affected due to performance reasons
    // setXIsNext(!xIsNext);
    //flipping whatever was there in xIsNext
    onPlay(nextSquares);
    //replacing the set calls by a single onPlay call so that game component can update the board when user clicks a square
  }
  //he parent Board component passes props to the child Square components so that they can be displayed correctly.
  //In React, it’s conventional to use onSomething names for props which represent events and handleSomething for the function definitions which handle those events.

  const winner = findWinner(squares); //returns either X or O or null
  const draw = checkDraw(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner + " !🥇";
  } else if (draw) {
    status = "Draw!";
  } else {
    status = "Next Player: " + (xIsNext ? "❌" : "⭕");
  }

  return (
    <>
      <div className="status">{status}</div>
      <br />
      <br />
      <br />
      <div className="board">
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0); //keep track of which step the user is viewing
  //array with a single item, that item being an array of 9 null items
  const currentSquares = history[currentMove]; //we want to read the last squares from history

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    //this is the spread syntax
    //For example, if history is [[null,null,null], ["X",null,null]] and nextSquares is ["X",null,"O"], then the new [...history, nextSquares] array will be [[null,null,null], ["X",null,null], ["X",null,"O"]].
    //If you “go back in time” and then make a new move from that point, you only want to keep the history up to that point. Instead of adding nextSquares after all items (... spread syntax) in history, you’ll add it after all items in history.slice(0, currentMove + 1) so that you’re only keeping that portion of the old history.
    //each time we make a move, we will have to update currentmove to point to the latest history entry.
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    //in js, to transform one array into another, we use the array map method
    // Ex- [1, 2, 3].map((x) => x * 2)
    //we will use map to transform our history of moves into react elements representing buttons of past moves on the screen
    //to update currentmove
    //we will set xIsNexxt to true if the number we are changing currentMove to is even
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
    //alternating between true and false for odd and even steps of moves
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => jumpTo(0)} className="history">
          🔁
        </button>
      </div>
    </div>
  );
}

function findWinner(squares) {
  //we will now have to write code for when the game is won, and there are no more turns to make
  //this function will take an array of 9 squares, find the winner and then return "X", "O" or null.
  //below are the possible configurations in which a win can be achieved
  //array on favourable indices
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function checkDraw(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let isDraw = true;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) ||
      !squares[a] ||
      !squares[b] ||
      !squares[c]
    ) {
      isDraw = false;
    }
  }
  if (isDraw === true) {
    return isDraw;
  }
  return false;
}
