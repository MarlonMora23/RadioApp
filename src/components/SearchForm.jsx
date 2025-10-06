import PropTypes from "prop-types";
import { Search, X } from "lucide-react";
import "../styles/search-form.css";

export default function SearchForm({ query, onQueryChange, onSearch, onClear }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre de emisora..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="clear-input-btn"
            aria-label="Limpiar búsqueda"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      <div className="search-buttons">
        <button type="submit" className="search-btn">
          Buscar
        </button>
        <button type="button" onClick={onClear} className="clear-btn">
          Limpiar resultados
        </button>
      </div>
    </form>
  );
}

SearchForm.propTypes = {
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};