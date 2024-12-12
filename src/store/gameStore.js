import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MODES, sudoku } from "./sudokuUtils";
const initialState = {
  isStart: false,
  isPause: false,
  isComplete: false,
  pencilMode: false,
  mistake: 0,
  hints: 0,
  totalMistakes: 5,
  time: 0,
  mode: MODES["easy"],
  board: Array.from({ length: 9 }, () => Array(9).fill(0)),
  qBoard: Array.from({ length: 9 }, () => Array(9).fill(0)),
  selectedCell: {
    row: null,
    col: null,
    squares: null,
  },
};
const gameState = (set) => ({
  ...initialState,
  startGame: (mode) => {
    const data = sudoku(mode);
    set({
      ...initialState,
      board: data.solvedBoard,
      qBoard: data.unSolvedBoard,
      isStart: true,
      hints: MODES[mode].hints,
      totalMistakes: MODES[mode].mistakes,
      mode: MODES[mode],
    });
  },
  tryAgain: () => {
    set((state) => {
      const qBoard = state.qBoard.map((row) =>
        row.map((item) => {
          if (item.default) return item;
          return { default: false, pencilValue: 0, value: 0 };
        })
      );
      return {
        ...state,
        qBoard,
        mistake: 0,
        hints: state.mode.hints,
        isComplete: false,
        isPause: false,
        time: 0,
      };
    });
  },
  pauseGame: () => {
    set((state) => ({ ...state, isPause: !state.isPause }));
  },
  continueGame: () => {
    set((state) => {
      if (localStorage.getItem("game")) {
        const game = JSON.parse(localStorage.getItem("game"));
        return game;
      }
      return state;
    });
  },
  tooglePencilMode: () => {
    set((state) => ({ ...state, pencilMode: !state.pencilMode }));
  },
  changeQBoard: (num) => {
    set((state) => {
      if (state.isPause || state.isComplete) return state;
      const row = state.selectedCell.row;
      const col = state.selectedCell.col;
      if (!row) return state;
      if (state.qBoard[row][col].default) return state;
      const qBoard = state.qBoard;
      let mistake = state.mistake;
      let isComplete = state.isComplete;
      if (state.pencilMode) {
        qBoard[row][col] = { ...qBoard[row][col], pencilValue: num };
      } else {
        qBoard[row][col] = { ...qBoard[row][col], value: num };
        if (qBoard[row][col].value != state.board[row][col]) mistake += 1;
        if (mistake >= state.totalMistakes) isComplete = true;
        let win = true;
        qBoard.forEach((row, rIdx) => {
          row.forEach((item, cIdx) => {
            if (item.value != state.board[rIdx][cIdx]) win = false;
          });
        });
        if (win) isComplete = true;
      }
      return { ...state, qBoard, mistake, isComplete };
    });
  },
  resetQBoard: () => {
    set(state=>{
        if(state.isPause || state.isComplete) return state
        let qBoard = state.qBoard
        qBoard = qBoard.map(row=>row.map(item=>{
            if(item.default)
                return item
            else
            return {...item,value:0,pencilValue:0}
        }))
        return {...state,qBoard}
    })
  },
  quitGame: () => {
    set(initialState);
  },
  setSelectedCell: (row, col) => {
    const iRow = Math.floor(row / 3) * 3;
    const iCol = Math.floor(col / 3) * 3;
    const squares = [];
    for (let x = iRow; x < iRow + 3; x++) {
      for (let y = iCol; y < iCol + 3; y++) {
        squares.push([x, y]);
      }
    }
    set({ selectedCell: { row, col, squares } });
  },
  useHint: () => {
    set((state) => {
      const row = state.selectedCell.row;
      const col = state.selectedCell.col;
      if (state.hints <= 0) return state;
      if (!row) return state;
      if (state.isPause || state.isComplete) return state;
      let qBoard = state.qBoard;
      if (qBoard[row][col].default) return state;
      qBoard[row][col] = { ...qBoard[row][col], value: state.board[row][col] };
      return { ...state, qBoard, hints: state.hints - 1 };
    });
  },
  increaseTime: () => {
    set((state) => {
      localStorage.setItem(
        "game",
        JSON.stringify({ ...state, time: state.time + 1 })
      );
      return { ...state, time: state.time + 1 };
    });
  },
  setState: () => {},
});
export const useGame = create(persist(gameState, { name: "board" }));
