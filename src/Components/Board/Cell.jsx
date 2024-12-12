import React from "react";
import { useGame } from "../../store/gameStore";

function Cell({ row, col }) {
  const { qBoard, setSelectedCell, selectedCell, board,isPause,isComplete} = useGame();
  function handleClick() {
    if(isPause || isComplete) return
    setSelectedCell(row, col);
  }
  function isSelected() {
    const query = { current: false, other: false };
    if(!selectedCell.row) return query
    for(let sq of selectedCell.squares){
      if(sq[0] == row && sq[1]==col) query.other = true
    }
    if (selectedCell.row == row && selectedCell.col == col)
      query.current = true;
    if (selectedCell.row == row || selectedCell.col == col) query.other = true;
    if (
      qBoard[row][col].value != 0 &&
      qBoard[row][col].value == qBoard[selectedCell.row][selectedCell.col].value
    )
      query.other = true;
    return query;
  }
  return (
    <div
      onClick={handleClick}
      className={`Cell  select-none relative flex items-center justify-center cursor-pointer bg-slate-800 w-full h-full rounded-md hover:outline outline-[1px] ${
        isSelected().current && "bg-neutral-950 outline outline-blue-500"
      } ${isSelected().other && "bg-slate-900"}`}
    >
      {qBoard[row][col].value != 0 && (
        <span
          className={`text-2xl md:text-3xl ${
            qBoard[row][col].default
              ? "text-white"
              : qBoard[row][col].value == board[row][col]
              ? "text-blue-500"
              : "text-red-500"
          }`}
        >
          {qBoard[row][col].value}
        </span>
      )}
      {qBoard[row][col].pencilValue != 0 && !qBoard[row][col].default && (
        <span
          className={`text-base md:text-2xl absolute -top-1 right-1 text-green-600`}
        >
          {qBoard[row][col].pencilValue}
        </span>
      )}
    </div>
  );
}

export default Cell;
