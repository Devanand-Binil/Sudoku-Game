import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-grow flex flex-col justify-center items-center gap-10">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-0">
        Created by Devanand Binil
      </footer>
    </div>
  );
}

export default App;
