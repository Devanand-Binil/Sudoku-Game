import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useRef ,useState } from "react";
import { useBoard } from "../../store/useBoard";
import { Link, useNavigate } from "react-router-dom";
import welcomeSound from "../sounds/start.mp3";

function Home() {
  const butonsRef = useRef([]);
  const modeRef = useRef();
  const { startGame, continueGame } = useBoard();
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const savedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    savedLeaderboard.sort((a, b) => a.time - b.time);
    setLeaderboard(savedLeaderboard);

    const sound = new Audio(welcomeSound);
    sound.play();
  }, []);


  function handleStart() {
    startGame(modeRef.current.value);
    localStorage.setItem("mode", modeRef.current.value);
    navigate("/game");
  }
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from("#Heading", {
      y: -50,
      opacity: 0,
      duration: 0.3,
      delay: 0.2,
    });
    tl.from(butonsRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.3,
      delay: 0.2,
      stagger: 0.1,
    });
  });
  useEffect(() => {
    modeRef.current.value = localStorage.getItem("mode")
      ? localStorage.getItem("mode")
      : "easy";
    butonsRef.current?.forEach((button) => {
      gsap.fromTo(
        button,
        { scale: 1 },
        {
          scale: 0.9,
          duration: 0.1,
          paused: true,
          ease: "power1.inOut",
          onComplete: () =>
            gsap.to(button, { scale: 1, duration: 0.1, ease: "power1.inOut" }),
        }
      );
      button.addEventListener("mousedown", () =>
        gsap.to(button, { scale: 0.9, duration: 0.1 })
      );
      button.addEventListener("mouseup", () =>
        gsap.to(button, { scale: 1, duration: 0.1 })
      );
      button.addEventListener("mouseleave", () =>
        gsap.to(button, { scale: 1, duration: 0.1 })
      );
    });
  }, []);
  return (
    
    <>
      <span id="Heading" className="text-7xl font-bold font-serif text-red-500 text-center">
        Sudoku Game
      </span>
      <div className="flex flex-col gap-5 items-center justify-center ">
        <button
          onClick={handleStart}
          ref={(el) => butonsRef.current.push(el)}
          className="option bg-slate-900 p-3 rounded-md hover:bg-slate-800  active:scale-90 w-full text-xl"
        >
          Start New
        </button>
        <button
          onClick={() => {
            continueGame();
            navigate("/game");
          }}
          ref={(el) => butonsRef.current.push(el)}
          className="option bg-slate-900 p-3 rounded-md hover:bg-slate-800  active:scale-90 w-full text-xl"
        >
          Continue
        </button>
        <div
          ref={(el) => butonsRef.current.push(el)}
          className="flex option justify-center items-center  gap-2 w-full place-items-center text-center"
        >
          <select
            className="bg-slate-900 p-3 rounded-lg text-center justify-center items-center w-full text-xl place-items-center appearance-none"
            id="mode"
            ref={modeRef}
            defaultValue=""
          >
            <option className="text-blue-400 w-full" value="" disabled>Select Mode</option>
            <option className="w-full" value="veryEasy">Very Easy</option>
            <option className="w-full" value="easy">Easy</option>
            <option className="w-full" value="medium">Medium</option>
            <option className="w-full" value="hard">Hard</option>
            <option className="w-full" value="extreme">Extreme</option>
          </select>
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
    ▼
  </span>
        </div>
        <button
          onClick={() => setShowLeaderboard(true)}
          ref={(el) => butonsRef.current.push(el)}
          className="option bg-slate-900 p-3 rounded-md hover:bg-slate-800 active:scale-90 w-full text-xl place-items-center"
        >
          Show Leaderboard
        </button>
        {showLeaderboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl font-bold mb-4 text-center">Leaderboard</h2>
            {leaderboard.length > 0 ? (
              <ul className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <li
                    key={index}
                    className="flex justify-between bg-gray-100 p-2 rounded-md"
                  >
                    <span>{entry.name}</span>
                    <span>{entry.time}s</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No scores yet!</p>
            )}
            <button
              onClick={() => setShowLeaderboard(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 active:scale-95 flex place-self-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default Home;
