// src/App.tsx

import Navbar from "./components/layout/Navbar";

function App() {
  // এখানে পরে Zustand বা Context API দিয়ে রিয়েল ডাটা বসাবে
  const isLoggedIn = false; // true করলেই প্রোফাইল দেখাবে
  const userRole = 'patient'; // 'patient' বা 'doctor'
  
  return (
    <div className="min-h-screen bg-emerald-50 w-full">
      <Navbar 
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userImage="https://ui-avatars.com/api/?name=Rahim+Ahmed&background=10b981&color=fff&size=40"
      />
      
      {/* বাকি কনটেন্ট */}
      <div className="container mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-bold text-emerald-800">Welcome to MediCare</h1>
      </div>
    </div>
  );
}

export default App;