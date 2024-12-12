import React, { useEffect, useRef, useState } from "react";
import { useBoard } from "../../store/useBoard";

export default function MiniSquare({ row, col }) {
  const { setSelectedCell, selectedCell, Qboard, board, isPause } = useBoard();
  const cellRef = useRef();
  function handleClick() {
    if (isPause) return;
    cellRef.current?.focus();
    setSelectedCell(row, col);
  }
  function isSelected() {
    const query = { other: false, current: false };
    if (selectedCell.cell) {
      selectedCell.squares.forEach((sq) => {
        if (sq[0] == row && sq[1] == col) query.other = true;
      });
      if (selectedCell.row == row) query.other = true;
      if (selectedCell.col == col) query.other = true;
      if (
        Qboard[row][col].value ==
          Qboard[selectedCell.row][selectedCell.col].value &&
        Qboard[row][col].value != 0
      )
        query.other = true;
      if (selectedCell.cell.row == row && selectedCell.cell.col == col)
        query.current = true;
    }
    return query;
  }

  return (
    <>
      <div
        ref={cellRef}
        onClick={handleClick}
        className={`miniBox select-none flex items-center justify-center cursor-pointer bg-slate-800 w-full h-full ${
          isSelected().current && "bg-neutral-950 outline outline-blue-500 outline-4"
        } ${
          isSelected().other && "bg-slate-600"
        } rounded-md hover:outline outline-[1px] relative`}
      >
        {!Qboard[row][col].value == 0 && (
          <span
            className={` ${
              Qboard[row][col].default
                ? "text-white"
                : Qboard[row][col].value == board[row][col]
                ? "text-blue-600"
                : "text-red-600"
            } text-2xl value md:text-3xl`}
          >
            {Qboard[row][col].value}
          </span>
        )}
        {!Qboard[row][col].pencilValue == 0 && !Qboard[row][col].default && (
          <span className={` text-green-600 value text-base md:text-2xl absolute -top-1 right-1`}>
            {Qboard[row][col].pencilValue}
          </span>
        )}
      </div>
    </>
  );
}
