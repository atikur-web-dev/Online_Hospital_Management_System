// src/App.tsx

import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";

function App() {
  const isLoggedIn = false;
  const userRole = 'patient';
  
  return (
    <div className="min-h-screen bg-emerald-50">
      <Navbar 
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userImage="https://ui-avatars.com/api/?name=Rahim+Ahmed&background=10b981&color=fff&size=40"
      />
      <Home />
    </div>
  );
}

export default App;