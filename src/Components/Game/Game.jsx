import React, { useEffect, useRef } from "react";
import { useBoard } from "../../store/useBoard";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Board from "../Board/Board";
import { Lightbulb, LogOut, Pause, PencilLine, Play } from "lucide-react";

export default function Game() {

  const [showPrompt, setShowPrompt] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [leaderboard, setLeaderboard] = React.useState([]);
  

  const {
    isStart,
    quitGame,
    useHint,
    hints,
    isPause,
    time,
    Qboard,
    tooglePencilMode,
    pencilMode,
    selectedCell,
    isComplete,
    increaseTime,
    pauseGame,
    changeBoard,
    resetBoard,
  } = useBoard();
  const timeRef = useRef();
  const navigate = useNavigate();
  function handleQuit() {
    gsap.to(".box", {
      y: -50,
      opacity: 0,
      duration: 0.1,
      stagger: 0.01,
      onComplete: () => {
        // Perform the action after the animation completes
        gsap.to(".option", {
          y: -50,
          opacity: 0,
          duration: 0.1,
          stagger: 0.01,
          onComplete: () => {
            navigate("/");
            quitGame();
          },
        });
      },
    });
  }
  function handlePause() {
    pauseGame();
  }
  function handleKeyPress(event) {
    if (event.key.toLowerCase() == "p") {
      pauseGame();
    }
    if (isPause) return;
    if (!selectedCell) return;
    if (parseInt(event.key)) {
      let num = parseInt(event.key);
      if (num < 1 && num > 9) return;
      changeBoard(num);
    }
  }
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [time, isPause, Qboard]);
  useEffect(() => {
    if (!isStart) {
      navigate("/", { replace: true });
    }
    timeRef.current = setInterval(() => {
      if (!isPause && !isComplete) increaseTime();
    }, 1000);
    return () => clearInterval(timeRef.current);
  }, [isPause, time, isComplete]);

  useEffect(() => {
    if (isComplete) {
      setShowPrompt(true);
      clearInterval(timeRef.current); // Stop the timer
    }
  }, [isComplete]);
  

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".miniBox", {
      y: -50,
      opacity: 0,
      duration: 0.1,
      stagger: 0.01,
    });
    tl.from(".defaultValue", {
      y: -50,
      opacity: 0,
      duration: 0.1,
      stagger: 0.01,
    });
    tl.from(".value", {
      y: -50,
      opacity: 0,
      duration: 0.1,
      stagger: 0.01,
    });
    tl.from(".option", {
      x: -50,
      opacity: 0,
      duration: 0.1,
      stagger: 0.02,
    });
  });
  return (
    <div className="flex flex-col items-center justify-center ">
      
      <Board />
      <div className="flex items-center justify-around w-full">
        <button
          onClick={handleQuit}
          className="option bg-slate-900 p-3 rounded-md hover:bg-slate-800 active:scale-90"
        >
          <LogOut />
        </button>
        <button
          onClick={handlePause}
          className="option bg-slate-900 pause p-3 disabled:opacity-35 disabled:hover:bg-slate-900 disabled:active:scale-100 rounded-md hover:bg-slate-800 active:scale-90"
        >
          {isPause ? <Play /> : <Pause />}
        </button>
        <button
          onClick={() => resetBoard()}
          disabled={isPause}
          className="option bg-slate-900 pause disabled:opacity-35 disabled:hover:bg-slate-900 disabled:active:scale-100 p-3 rounded-md hover:bg-slate-800 active:scale-90"
        >
          Reset
        </button>
        <button
          onClick={() => tooglePencilMode()}
          className={`option bg-slate-900 pause disabled:opacity-35 disabled:hover:bg-slate-900 disabled:active:scale-100 p-3 rounded-md hover:bg-slate-800 active:scale-90 ${
            pencilMode && "text-green-600"
          }`}
        >
          <PencilLine />
        </button>
        <button
          onClick={() => useHint()}
          disabled={isPause}
          className="option bg-slate-900 pause disabled:opacity-35 disabled:hover:bg-slate-900 disabled:active:scale-100 p-3 rounded-md hover:bg-slate-800 active:scale-90 relative"
        >
          <span className="absolute h-6 w-6 -right-3 -top-3 flex items-center justify-center text-xl bg-blue-700 text-white p2 rounded-full">
            {hints}
          </span>
          <Lightbulb />
        </button>
      </div>
    </div>
  );
}
