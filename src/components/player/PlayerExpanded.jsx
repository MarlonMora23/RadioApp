import { useAudioPlayer } from "../../context/PlayerContext";
import PlayerControls from "./PlayerControls";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/player-expanded.css";

export default function PlayerExpanded() {
  const {
    currentStation,
    isPlaying,
    playPause,
    playNext,
    playPrev,
    volume,
    setVolume,
    expanded,
    setExpanded,
  } = useAudioPlayer();

  return (
    <AnimatePresence>
      {expanded && currentStation && (
        <motion.div
          className="player-expanded-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="player-expanded-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <div className="player-expanded-header">
              <button
                className="close-btn"
                onClick={() => setExpanded(false)}
                aria-label="Close Player"
              >
                <ChevronDown size={28} />
              </button>
            </div>

            <div className="player-expanded-body">
              <div className="station-logo-wrapper">
                <img
                  src={currentStation.logo || "/fallback-logo.png"}
                  alt={currentStation.name}
                  className="station-logo-large"
                />
              </div>
              <div className="station-info">
                <h2>{currentStation.name}</h2>
                <p>{currentStation.country}</p>
              </div>
            </div>

            <div className="player-expanded-controls">
              <PlayerControls
                isPlaying={isPlaying}
                onPlayPause={playPause}
                onNext={playNext}
                onPrev={playPrev}
                volume={volume}
                onVolumeChange={setVolume}
              />
            </div>

            {/* <div className="player-expanded-footer">
              {currentStation.tags && (
                <p className="tags">{currentStation.tags}</p>
              )}
              {!currentStation.tags && <p className="tags">No tags</p>}
            </div> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
