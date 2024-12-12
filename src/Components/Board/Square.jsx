import React from "react";
import MiniSquare from "./MiniSquare";


function Square({row,col}) {
  return (
    <>
      <div className="box w-full h-full gap-1 flex flex-col">
        <div className="flex gap-1 w-full h-full">
          <MiniSquare row={row*3}col={col*3}/>
          <MiniSquare row={row*3}col={col*3+1}/>
          <MiniSquare row={row*3}col={col*3+2}/>
        </div>
        <div className="flex gap-1 w-full h-full">
          <MiniSquare row={row*3+1}col={col*3}/>
          <MiniSquare row={row*3+1}col={col*3+1}/>
          <MiniSquare row={row*3+1}col={col*3+2}/>
        </div>
        <div className="flex gap-1 w-full h-full">
          <MiniSquare row={row*3+2}col={col*3}/>
          <MiniSquare row={row*3+2}col={col*3+1}/>
          <MiniSquare row={row*3+2}col={col*3+2}/>
        </div>
      </div>
    </>
  );
}

export default Square;
