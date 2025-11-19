import { useEffect, useCallback  } from "react";
import useStations from "../hooks/useStations";
import StationCard from "../components/StationCard";
import Loader from "../components/Loader";
import "../styles/home-page.css";

export default function HomePage() {
  const {
    radios,
    loading,
    error,
    hasMore,
    fetchByCountry,
    fetchMoreByCountry,
  } = useStations();

  useEffect(() => {
    fetchByCountry("Colombia");
  }, [fetchByCountry]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 300;
    if (scrollPosition >= threshold && hasMore && !loading) {
      fetchMoreByCountry();
    }
  }, [hasMore, loading, fetchMoreByCountry]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="header-content">
          <span className="header-flag">🇨🇴</span>
          <div className="header-text">
            <h1 className="header-title">Emisoras de Colombia</h1>
            <p className="header-subtitle">
              Las mejores estaciones de radio colombianas en un solo lugar
            </p>
          </div>
        </div>
      </div>

      {loading && <Loader fullScreen />}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="stations-info">
            <p className="stations-count">
              Mostrando {radios.length} emisoras
            </p>
          </div>

          <div className="stations-grid">
            {radios.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                stationList={radios}
              />
            ))}
          </div>
        </>
      )}

      {!loading && !error && radios.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📻</div>
          <h3 className="empty-title">No se encontraron emisoras</h3>
          <p className="empty-subtitle">
            Intenta buscar emisoras desde la página de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
