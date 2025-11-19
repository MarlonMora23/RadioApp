import { useState, useCallback, useRef } from "react";
import axios from "axios";

const apiBaseRB = import.meta.env.VITE_RB_URL;
const apiBaseTI = import.meta.env.VITE_TI_URL;

// Tamaño de lote para paginación incremental
const PAGE_SIZE = 50;

export default function useRadios() {
  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  // Cache en memoria por país y por nombre
  const cacheRef = useRef({
    byCountry: {},
    byName: {},
  });

  // Estado de paginación actual
  const paginationRef = useRef({
    country: null,
    allResults: [],
    currentPage: 0,
  });

  const fetchByCountry = useCallback(async (country = "Colombia") => {
    setLoading(true);
    setError(null);

    // 1️⃣ Revisar caché
    if (cacheRef.current.byCountry[country]) {
      const cachedResults = cacheRef.current.byCountry[country];
      paginationRef.current = {
        country,
        allResults: cachedResults,
        currentPage: 1,
      };
      setRadios(cachedResults.slice(0, PAGE_SIZE));
      setHasMore(cachedResults.length > PAGE_SIZE);
      setLoading(false);
      return;
    }

    // 2️⃣ Si no está en caché → Fetch a APIs
    let results = [];

    // --- RadioBrowser ---
    try {
      const rb = await axios.get(
        `${apiBaseRB}/stations/bycountry/${encodeURIComponent(country)}`,
        { timeout: 12000 }
      );

      if (Array.isArray(rb.data) && rb.data.length) {
        results = rb.data.map((r) => ({
          id: r.stationuuid,
          name: r.name,
          country: r.country,
          streamUrls: [r.url_resolved].filter(Boolean),
          logo: r.favicon || null,
          tags: typeof r.tags === "string" ? r.tags : "",
          source: "RadioBrowser",
        }));
      }
    } catch (e) {
      // Ignorar, sigue con TuneIn
    }

    // --- TuneIn ---
    if (results.length === 0) {
      try {
        const ti = await axios.get(`${apiBaseTI}/Search.ashx`, {
          params: { query: country, render: "json", formats: "mp3,aac" },
          timeout: 12000,
        });
        const body = ti?.data?.body || [];
        const audios = body.filter((x) => x.type === "audio");
        if (audios.length) {
          results = audios.map((s) => ({
            id: s.guide_id,
            name: s.text,
            country,
            streamUrls: [s.URL].filter(Boolean),
            logo: s.image || null,
            tags: s.subtext || "",
            source: "TuneIn",
          }));
        }
      } catch (e) {
        setError(e.message || "Error en TuneIn");
      }
    }
      
    // 3️⃣ Guardar en caché y paginar
    cacheRef.current.byCountry[country] = results;
    paginationRef.current = {
      country,
      allResults: results,
      currentPage: 1,
    };

    setRadios(results.slice(0, PAGE_SIZE));
    setHasMore(results.length > PAGE_SIZE);
    setLoading(false);
  }, []);

  const fetchMoreByCountry = useCallback(() => {
    const { allResults, currentPage } = paginationRef.current;
    if (!allResults.length) return;

    const nextPage = currentPage + 1;
    const start = (nextPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const newItems = allResults.slice(start, end);

    setRadios((prev) => [...prev, ...newItems]);
    paginationRef.current.currentPage = nextPage;
    setHasMore(allResults.length > end);
  }, []);

  const fetchByName = useCallback(async (name) => {
    setLoading(true);
    setError(null);

    // 1️⃣ Revisar caché
    if (cacheRef.current.byName[name]) {
      setRadios(cacheRef.current.byName[name]);
      setLoading(false);
      return;
    }

    // 2️⃣ Buscar en RadioBrowser
    try {
      const rb = await axios.get(
        `${apiBaseRB}/stations/search?name=${encodeURIComponent(name)}`,
        { timeout: 12000 }
      );

      if (Array.isArray(rb.data) && rb.data.length) {
        const mapped = rb.data.map((r) => ({
          id: r.stationuuid,
          name: r.name,
          country: r.country,
          streamUrls: [r.url_resolved].filter(Boolean),
          logo: r.favicon || null,
          tags: typeof r.tags === "string" ? r.tags : "",
          source: "RadioBrowser",
        }));
        cacheRef.current.byName[name] = mapped;
        setRadios(mapped);
        setLoading(false);
        return;
      }
    } catch (e) {
      
    }

    setRadios([]);
    setError(`No se encontraron emisoras con el nombre "${name}".`);
    setLoading(false);
  }, []);

  const clearRadios = useCallback(() => {
    setRadios([]);
    setError(null);
  }, []);

  return {
    radios,
    loading,
    error,
    hasMore,
    fetchByCountry,
    fetchMoreByCountry,
    fetchByName,
    clearRadios,
  };
}
