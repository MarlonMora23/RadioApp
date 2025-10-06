import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [stations, setStations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [expanded, setExpanded] = useState(false);

  const currentStation = currentIndex >= 0 ? stations[currentIndex] : null;

  // Resolver URL de TuneIn / m3u / pls antes de reproducir
  async function resolveStreamUrl(url) {
    try {
      if (!url || typeof url !== "string") return url;

      const lower = url.toLowerCase();
      const needsResolve =
        lower.includes("radiotime.com/tune.ashx") ||
        lower.endsWith(".m3u") ||
        lower.endsWith(".pls");

      if (!needsResolve) return url;

      const res = await fetch(url);
      const text = await res.text();

      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#") && !l.startsWith(";"));

      const candidate = lines.find((l) => /^https?:\/\//i.test(l));
      return candidate || url;
    } catch (err) {
      console.warn("[resolveStreamUrl] error", err);
      return url;
    }
  }

  // Sync volume with element
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Handle audio end / errors gracefully
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      playNext();
    };

    const handleError = () => {
      toast.error("Esta emisora no está disponible. Pasando a la siguiente...");
      playNext();
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [stations, currentIndex]);

  // Play specific station
  const playStation = useCallback(
    async (station, stationList = []) => {
      if (!station || !station.streamUrls?.length) return;

      // pick the first declared URL (we will resolve it)
      let originalUrl = station.streamUrls[0];

      if (stationList && stationList.length) {
        setStations(stationList);
        const idx = stationList.findIndex((s) => s.id === station.id);
        setCurrentIndex(idx >= 0 ? idx : 0);
      } else {
        const idx = stations.findIndex((s) => s.id === station.id);
        if (idx !== -1) {
          setCurrentIndex(idx);
        } else {
          setStations([station]);
          setCurrentIndex(0);
        }
      }

      // resolve URL if necessary
      let urlToPlay = originalUrl;
      try {
        const resolved = await resolveStreamUrl(originalUrl);
        urlToPlay = resolved || originalUrl;
        console.log(
          "[DEBUG] Original URL:",
          originalUrl,
          "Resolved URL:",
          urlToPlay
        );
      } catch (err) {
        console.warn(
          "[DEBUG] resolveStreamUrl failed, using original URL",
          err
        );
        urlToPlay = originalUrl;
      }

      const audio = audioRef.current;

      // assign and try to play
      try {
        audio.src = urlToPlay;
        // ensure metadata/loading
        if (typeof audio.load === "function") audio.load();

        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback failed:", err);
        setIsPlaying(false);

        // try fallbacks: if station has other streamUrls, try them one by one
        const others = station.streamUrls.filter((s) => s !== originalUrl);
        for (const candidate of others) {
          try {
            const resolvedCandidate = await resolveStreamUrl(candidate);
            console.log("[DEBUG] Trying fallback URL:", resolvedCandidate);
            audio.src = resolvedCandidate;
            if (typeof audio.load === "function") audio.load();
            await audio.play();
            setIsPlaying(true);
            return; // success, stop trying more
          } catch (err2) {
            console.warn("Fallback playback failed:", err2);
            setIsPlaying(false);
            // continue to next fallback
          }
        }
      }
    },
    [stations]
  );

  // ⏯ Toggle play/pause
  const playPause = useCallback(() => {
    const audio = audioRef.current;
    if (!currentStation) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true));
    }
  }, [isPlaying, currentStation]);

  // ⏭ Next station
  const playNext = useCallback(() => {
    if (stations.length === 0) return;
    const nextIndex = (currentIndex + 1) % stations.length;
    const nextStation = stations[nextIndex];
    setCurrentIndex(nextIndex);
    playStation(nextStation);
  }, [currentIndex, stations, playStation]);

  // ⏮ Prev station
  const playPrev = useCallback(() => {
    if (stations.length === 0) return;
    const prevIndex = (currentIndex - 1 + stations.length) % stations.length;
    const prevStation = stations[prevIndex];
    setCurrentIndex(prevIndex);
    playStation(prevStation);
  }, [currentIndex, stations, playStation]);

  const value = {
    stations,
    setStations,
    currentStation,
    isPlaying,
    volume,
    expanded,
    setExpanded,
    playStation,
    playPause,
    playNext,
    playPrev,
    setVolume,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

AudioPlayerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
}
