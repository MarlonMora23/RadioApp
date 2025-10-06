import PropTypes from "prop-types";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import "../../styles/player-controls.css";

export default function PlayerControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  volume,
  onVolumeChange,
}) {
  return (
    <div className="player-controls">
      <div className="player-buttons">
        <button onClick={onPrev} className="control-btn" aria-label="Previous">
          <SkipBack size={20} />
        </button>

        <button
          onClick={onPlayPause}
          className="control-btn play-btn"
          aria-label="Play/Pause"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button onClick={onNext} className="control-btn" aria-label="Next">
          <SkipForward size={20} />
        </button>
      </div>

      <div className="volume-control">
        <Volume2 size={18} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}

PlayerControls.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
};
