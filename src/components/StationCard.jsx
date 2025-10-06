import {useAudioPlayer} from "../context/PlayerContext";
import "../styles/station-card.css";
import { Play, Pause } from "lucide-react";

export default function StationCard({ station, stationList }) {
 const { playStation, currentStation, isPlaying } = useAudioPlayer();

  const handlePlay = () => {
    playStation(station, stationList);
  };

  const isCurrentStation = currentStation?.id === station.id;

  return (
    <div className={`station-card ${isCurrentStation ? "active" : ""}`}>
      <div className="station-card-image-wrapper">
        <img
          src={station.logo || "/fallback-logo.png"}
          alt={station.name}
          className="station-card-logo"
          onError={(e) => {
            e.target.src = "/fallback-logo.png";
          }}
        />
        <button 
          className="station-card-play-overlay" 
          onClick={handlePlay}
          aria-label={isCurrentStation && isPlaying ? "Pausar" : "Reproducir"}
        >
          <div className="play-icon">
            {isCurrentStation && isPlaying ? (
              <Pause size={32} fill="white" />
            ) : (
              <Play size={32} fill="white" />
            )}
          </div>
        </button>
      </div>

      <div className="station-card-body">
        <h3 className="station-card-name" title={station.name}>
          {station.name}
        </h3>
        <p className="station-card-country">{station.country}</p>
        {station.tags && (
          <p className="station-card-tags">{station.tags}</p>
        )}
      </div>
    </div>
  );
}
