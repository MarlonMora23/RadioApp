import { useAudioPlayer } from "../../context/PlayerContext";
import { Play, Pause, ChevronUp, SkipBack, SkipForward } from "lucide-react";
import PropTypes from "prop-types";
import "../../styles/player-bar.css"

export default function NowPlayingBar() {
  const {
    currentStation,
    isPlaying,
    playPause,
    playNext,
    playPrev,
    setExpanded,
  } = useAudioPlayer();

  if (!currentStation) return null;

  return (
    <div className="player-bar">
      <div className="player-bar-content" onClick={() => setExpanded(true)}>
        <img
          src={currentStation.logo || "/fallback-logo.jpg"}
          alt={currentStation.name}
          className="player-bar-logo"
        />
        <div className="player-bar-info">
          <h4>{currentStation.name}</h4>
          <p>{currentStation.country}</p>
        </div>
      </div>

      <div className="player-bar-controls">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            playPrev();
          }} 
          className="control-btn"
          aria-label="Anterior"
        >
          <SkipBack size={20} />
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            playPause();
          }} 
          className="control-btn play-btn"
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            playNext();
          }} 
          className="control-btn"
          aria-label="Siguiente"
        >
          <SkipForward size={20} />
        </button>

        <button 
          onClick={() => setExpanded(true)} 
          className="control-btn expand-btn hide-mobile"
          aria-label="Expandir Reproductor"
        >
          <ChevronUp size={22} />
        </button>
      </div>
    </div>
  );
}

NowPlayingBar.propTypes = {
  station: PropTypes.object,
};