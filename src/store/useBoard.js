import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MODES, suduko } from "./SudukoUtils";
const initialState = {
  isStart: false,
  isPause: false,
  isCustom: false,
  isComplete: false,
  pencilMode:false,
  mistake: 0,
  totalMistakes: 5,
  hints: 0,
  time: 0,
  mode: MODES.easy,
  board: Array.from({ length: 9 }, () => Array(9).fill(0)),
  Qboard: Array.from({ length: 9 }, () => Array(9).fill(0)),
  allEntries: [],
  selectedCell: {
    cell: null,
    squares: null,
    row: null,
    col: null,
  },
};
const gameState = (set) => ({
  ...initialState,
  startGame: (mode) => {
    const board = suduko(mode);
    set({
      ...initialState,
      board: board.solvedBoard,
      Qboard: board.unSolvedBoard,
      isStart: true,
      isActive: true,
      totalMistakes: MODES[mode].mistakes,
      hints: MODES[mode].hints,
      mode: MODES[mode],
    });
  },
  tryAgain: () => {
    set((state) => {
      let Qboard = state.Qboard.map((row) =>
        row.map((item) => {
          if (item.default) {
            return item;
          }
          return { default: false, value: 0 };
        })
      );
      return {
        ...state,
        Qboard,
        allEntries: [],
        mistake: 0,
        hints: MODES[state.mode.key].hints,
        isComplete: false,
        time: 0,
      };
    });
  },
  pauseGame: () => {
    set((state) => ({
      ...state,
      isPause: !state.isPause,
      isActive: !state.isPause,
    }));
  },
  continueGame: () => {
    const oldGame = JSON.parse(localStorage.getItem("oldboard"));
    set((state) => ({ ...state, ...oldGame }));
  },
  tooglePencilMode: () => {
    set((state) => ({ ...state, pencilMode:!state.pencilMode }));
  },
  changeBoard: (element) => {
    set((state) => {
      // if (!state.isActive) return state;
      if (
        state.Qboard[state.selectedCell.row][state.selectedCell.col].default ||
        state.mistake >= state.totalMistakes
      )
        return state;
      let Qboard = state.Qboard;
      const query = {};
      if(state.pencilMode){
        Qboard[state.selectedCell.row][state.selectedCell.col] = {
          ...Qboard[state.selectedCell.row][state.selectedCell.col],
          pencilValue: element,
          default: false,
        };
      }else{
        Qboard[state.selectedCell.row][state.selectedCell.col] = {
          ...Qboard[state.selectedCell.row][state.selectedCell.col],
          value:element,
          default: false,
        }
      }
      if (
        (Qboard[state.selectedCell.row][state.selectedCell.col].value !=
        state.board[state.selectedCell.row][state.selectedCell.col]) && !state.pencilMode
      )
        query.mistake = state.mistake + 1;
      let entries = state.allEntries;
      entries.push([state.selectedCell.row][state.selectedCell.col]);
      let win = true
      Qboard.forEach((row,rowIdx)=>{
        row.forEach((item,colIdx)=>{
          if(item.value!=state.board[rowIdx][colIdx])
            win = false
        })
      })
      if(win) query.isComplete=true
      if (query.mistake >= state.totalMistakes)
        return {
          ...state,
          Qboard,
          allEntries: entries,
          ...query,
          isComplete: true,
        };
      return { ...state, Qboard, allEntries: entries, ...query };
    });
  },
  resetBoard: () => {
    set((state) => {
      let Qboard = state.Qboard.map((row) =>
        row.map((item) => {
          if (item.default) {
            return item;
          }
          return { default: false, value: 0 };
        })
      );
      return { ...state, Qboard, allEntries: [] };
    });
  },
  quitGame: () => {
    set(initialState);
  },
  setSelectedCell: (row, col) => {
    let sqRow = Math.floor(row / 3) * 3;
    let sqCol = Math.floor(col / 3) * 3;
    const allSquares = [];
    for (let x = sqRow; x < sqRow + 3; x++)
      for (let y = sqCol; y < sqCol + 3; y++) {
        allSquares.push([x, y]);
      }
    set((state) => {
      if (state.isPause || state.isComplete) return state;
      return {
        ...state,
        selectedCell: {
          cell: { row, col },
          squares: allSquares,
          row,
          col,
        },
      };
    });
  },
  useHint: () => {
    set((state) => {
      if (state.selectedCell.cell && state.hints > 0) {
        let Qboard = state.Qboard;
        Qboard[state.selectedCell.row][state.selectedCell.col] = {
          default: false,
          value: state.board[state.selectedCell.row][state.selectedCell.col],
        };
        return { ...state, Qboard, hints: state.hints - 1 };
      }
      return state;
    });
  },
  increaseTime: () => {
    set((state) => {
      localStorage.setItem("oldboard", JSON.stringify(state));
      return { ...state, time: state.time + 1 };
    });
  },
  setTime: (seconds) => {
    set((state) => ({ ...state, time: seconds }));
  },
  setState: (newState) => {
    set((state) => ({ ...state, ...newState }));
  },
})
export const useBoard = create(persist(gameState,{name:"board"}));
