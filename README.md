# REACT DOCUMENTATION TUTORIAL

## Follow along the tutorial in react docs till you reach the additional improvements section

- return only single JSX element. With multiple adjacent elements wrap them in fragment. <></>

- Pass data to functions thru props. You can only send one prop. It can have multiple values. like so: function component( { value, someFunc } )

- To use variable or functions inside JSX syntax wrap them in curly braces lik so: {someVar} or {someFunction} . They can be passed as values to element attributes.

- A child component cannot directly access state bcoz state is private to the component that defines it. A sol is to pass a function ( that can alter the state of the value ) down as a function defined in the parent component which can be called from the child.

- When passing a function that alters state as a value to a JSX element you cannot pass it as a function call ie. onClick={doThis()}. [ This is bcoz when the component is rendered the function call is part of the rendered tree and so it will be executed and it alters the state of the component and the entire component will be re-rendered again leading to an infinite loop. ComponentDidMount → call Function → change state of component → ComponentDidUpdate → call function → change …. and so on ].
- To solve this issue we pass the function as a prop instead of calling it! We could use a handler funciton to call the actual function and pass on that handler as a prop for each. And instead of defining handler functions for every function that has arguments we use shorthand syntax like so: onClick = { ( ) => someFunction() }

- Immutability : It is better to not mutate the data by changing the data’s values.
    - It makes complex feats easier to implement like undo redo actions which is a common functionality. Avoiding direct data mutations and keeping previous data intact, we can reuse them for later.
    - By default all child components re-render automatically when the state of a parent component changes ( including unaffected ones ). Even though the re-render might not be visible to the eye, we should want to skip it for performance reasons. Immu makes it cheap for comps to compare whether their data has changed or not.
    

- When a function has to be run everytime the component is rendered like a check of truth value of some logic then it can just be defined in the body like :
    - const check = someLogic( value/state );
    - for loops:
        - for (let i in array2D) **i** is a counter
        - for (let i of array2d) **i** is 1d array // row

- Enumerate all items function : [ …var ] → create a new object that contains all items in var ( spread syntax )

- when rendering list or any tag inside a loop mechanism, pass **“key”** values ( unique ) to the <li> tag so that list knows how to handle each list tag with its identifier key. React decides which components to render based on key. It is not a prop. Do not use array indices as key - complicates re-ordering a list’s items or inserting/removing list items. Key need to be uniques between components and their siblings : they need not be globally unique.

## ********************ADDITIONAL IMPROVEMENTS********************

### 1. S**how the last move as a text instead of a button**

Check if the move is the current move being shown and return it as a list item without button.

```jsx
// Game component
const moves = history.map((squares, move) => {
    let description;
    console.log(move, currentMove);
    console.log(move === currentMove);
    if (move === currentMove) {
      console.log("success");
      return <li key={move}>You are at move #{move} </li>;
    }
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
```

### 2. U**se loop to create the board and return as a component**

Create the entire board and store it in a variable and return only that variable instead of returning each row multiple times. First loop is to store each row. Second loop is for creating the row.

```jsx
// Board component
const LoopBoard = () => {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(
          <Square
            value={squares[3 * i + j]}
            onSquareClick={() => handleClick(3 * i + j)}
          />
        );
      }
      board.push(<div className="board-row">{row}</div>);
    }
    return board;
  };
```

Inside the component use push() to add JSX array values to the element and return the element

### 3. **********************************************************Reverse the list using button**********************************************************

```jsx
//Game component
const [toggleAsce,setToggleAsce] = useState(true)
...
return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={()=>{
          setToggleAsce(!toggleAsce)} //toggleAsce?false:true stoopid
          }>
            Toggle
            {console.log(toggleAsce)}
        </button>
        <ol>{toggleAsce? moves: moves.reverse()}</ol>
      </div>
    </div>
  );
```

Use toggle state and set the moves accordingly using a check before rendering

### 4. **************Highlight the winning boxes and state draw should it occur**************

Return the winning squares along with the object and store them in winner. Change the style of those box after checking for winning directly in the jsx element.

```jsx
// LoopBoard component inside Board Component
let squareNumber = 3 * i + j;
        console.log(winner && squareNumber in winner[1]);
        row.push(
          <Square
            value={squares[squareNumber]}
            onSquareClick={() => handleClick(squareNumber)}
            squareStyle={
              winner &&
              (squareNumber === winner[1].a ||
                squareNumber === winner[1].b ||
                squareNumber === winner[1].c)
                ? "square win"
                : "square"
            }
          />
        );
//CSS
.win{
	background:red;
}
```

### 5. **********Display the row and col of each square that is moved in the history list**********

pass the selected square up to the game component in handleClick method

```jsx
//handleClick function in Board Component
function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares;
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares, i);
  }
```

store the square sequence along with the move to history as a object

```jsx
// Game conponent
function handlePlay(nextSquares, i) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      {
        squares : nextSquares,
        latestMoveSquare : i
      }
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
```

The “cannot read property ‘0’ of undefined” error occurs when you try to access the `0` index of an array-like variable, but the variable turns out to be `undefined`. To fix it, initialize the variable to a value of the correct data type before accessing the index.

when assigning a variable use a fallback : When array is undefined we need to provide a empty array to the variable. 

[https://codingbeautydev.com/blog/javascript-cannot-read-property-0-of-undefined/#:~:text=November 14%2C 2022-,The “cannot read property '0' of undefined” error,type before accessing the index](https://codingbeautydev.com/blog/javascript-cannot-read-property-0-of-undefined/#:~:text=November%2014%2C%202022-,The%20%E2%80%9Ccannot%20read%20property%20'0'%20of%20undefined%E2%80%9D%20error,type%20before%20accessing%20the%20index).

In this case we need to handle the above case when passing the currentSquare as a prop to the board component inside the game component. nullish operator

```jsx
// Game component
<Board
    xIsNext={xIsNext}
		squares={currentSquares.squares ?? []}
		onPlay={handlePlay}
		currentMove={currentMove}
/>
```

another solution is

The optional chaining operator is a concise way to prevent this error: { this didnt work }

```
const arr = [[1, 2, 3]];

// ✅ No errorconsole.log(arr?.[1]?.[0]);// undefined
```

another solution is to set a  default parameter to the squares prop in the board component that gets assigned when a false value is passed

```jsx
//Game component
squares={currentSquares && currentSquares.squares}
//Board component
function Board({ xIsNext, squares=[], onPlay, currentMove }) {
...
}
```
