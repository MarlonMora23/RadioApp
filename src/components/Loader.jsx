import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";
import "../styles/loader.css";

export default function Loader({ size = 50, color = "#a855f7", fullScreen = false }) {
  return (
    <div className={fullScreen ? "loader-container fullscreen" : "loader-container"}>
      <ClipLoader size={size} color={color} />
      {fullScreen && <p className="loader-text">Cargando emisoras...</p>}
    </div>
  );
}

Loader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  fullScreen: PropTypes.bool,
};