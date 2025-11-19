import { useState, useEffect } from "react";
import useStations from "../hooks/useStations";
import StationCard from "../components/StationCard";
import CountryFilterButtons from "../components/CountryFilterButtons";
import Loader from "../components/Loader";
import SearchForm from "../components/SearchForm";
import "../styles/search-page.css";

const PRESET_COUNTRIES = ["Colombia", "Peru", "Mexico", "Canada", "Spain"];

export default function SearchPage() {
  const {
    radios,
    loading,
    error,
    hasMore,
    fetchByName,
    fetchByCountry,
    fetchMoreByCountry,
    fetchMoreByName,
    clearRadios,
  } = useStations();
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchMode, setSearchMode] = useState(null);
  const [activeCountry, setActiveCountry] = useState(null);

  const handleSearch = (e) => {
    if (query.trim() === "") return;

    setHasSearched(true);
    setSearchMode("name");
    setActiveCountry(null);

    fetchByName(query);
  };

  const handleCountryClick = (country) => {
    setSearchMode("country");
    setHasSearched(true);
    setActiveCountry(country);
    setQuery("");

    fetchByCountry(country);
  };

  const handleClear = () => {
    clearRadios();
    setQuery("");
    setHasSearched(false);
    setSearchMode(null);
    setActiveCountry(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 300;

      if (scrollPosition >= threshold && hasMore && !loading) {
        if (searchMode === "name") {
          fetchMoreByName(query);
        } else if (searchMode === "country" && activeCountry) {
          fetchMoreByCountry(activeCountry);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [query, searchMode, activeCountry, hasMore, loading]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="search-title">🔍 Buscar Emisoras</h1>
        <p className="search-subtitle">
          Encuentra emisoras de radio de todo el mundo
        </p>
      </div>

      <SearchForm
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <CountryFilterButtons
        countries={PRESET_COUNTRIES}
        onSelect={handleCountryClick}
      />

      {loading && <Loader fullScreen />}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && radios.length > 0 && (
        <>
          <div className="results-info">
            <p className="results-count">
              Mostrando {radios.length} emisoras
            </p>
          </div>

          <div className="stations-list">
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

      {!loading && !error && radios.length === 0 && hasSearched && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">No se encontraron emisoras</h3>
          <p className="empty-subtitle">
            Intenta con otro término de búsqueda o selecciona un país
          </p>
        </div>
      )}
    </div>
  );
}
