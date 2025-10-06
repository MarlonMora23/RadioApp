import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AudioPlayerProvider } from "./context/PlayerContext.jsx";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import NowPlayingBar from "./components/player/NowPlayingBar";
import PlayerExpanded from "./components/player/PlayerExpanded";
import { Toaster } from "react-hot-toast";
import "./styles/globals.css";
import "./styles/app.css";

function App() {
  return (
    <AudioPlayerProvider>
      <Router>
        <div className="app-container">
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>

          {/* Reproductor global persistente en la parte inferior */}
          <NowPlayingBar />
          <PlayerExpanded />

          {/* Notificaciones */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
          />
        </div>
      </Router>
    </AudioPlayerProvider>
  );
}

export default App;
