import { useAudioPlayer } from "../context/PlayerContext";
import { AlertCircle, X } from "lucide-react";
import "../styles/error-toast.css";

export default function ErrorToast() {
  const { errorMessage, setExpanded } = useAudioPlayer();

  if (!errorMessage) return null;

  return (
    <div className="error-toast">
      <div className="error-toast-content">
        <AlertCircle className="error-icon" size={24} />
        <p className="error-text">{errorMessage}</p>
      </div>
    </div>
  );
}