import PropTypes from "prop-types";
import "../styles/country-filters.css";

const countryFlags = {
  Colombia: "🇨🇴",
  Peru: "🇵🇪",
  Mexico: "🇲🇽",
  Canada: "🇨🇦",
  Spain: "🇪🇸",
};

export default function CountryFilterButtons({ countries, onSelect }) {
  return (
    <div className="country-filters">
      <p className="country-filters-label">Búsqueda rápida por país:</p>
      <div className="country-filters-grid">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => onSelect(country)}
            className="country-btn"
          >
            <span className="country-flag">{countryFlags[country] || "🌍"}</span>
            <span className="country-name">{country}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

CountryFilterButtons.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};