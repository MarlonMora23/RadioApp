import { useState } from "react";
import useStations from "../hooks/useStations";
import StationCard from "../components/StationCard";
import CountryFilterButtons from "../components/CountryFilterButtons";
import Loader from "../components/Loader";
import SearchForm from "../components/SearchForm";
import "../styles/search-page.css";

const PRESET_COUNTRIES = ["Colombia", "Peru", "Mexico", "Canada", "Spain"];

export default function SearchPage() {
  const { radios, loading, error, fetchByName, fetchByCountry, clearRadios } =
    useStations();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    if (query.trim() === "") return;
    fetchByName(query);
  };

  const handleCountryClick = (country) => {
    fetchByCountry(country);
    setQuery("");
  };

  const handleClear = () => {
    clearRadios();
    setQuery("");
  };

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
              {radios.length} emisoras encontradas
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

      {!loading && !error && radios.length === 0 && query && (
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