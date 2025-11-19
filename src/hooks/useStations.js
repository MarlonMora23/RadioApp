import { useState, useCallback, useRef } from "react";
import axios from "axios";

const RB = "/rb/json";
const TI = "/ti";

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
        `${RB}/stations/bycountry/${encodeURIComponent(country)}`,
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
        const ti = await axios.get(`${TI}/Search.ashx`, {
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

    // Revisar caché
    if (cacheRef.current.byName[name]) {
      const cached = cacheRef.current.byName[name];

      paginationRef.current = {
        country: null,
        allResults: cached,
        currentPage: 1,
      };

      setRadios(cached.slice(0, PAGE_SIZE));
      setHasMore(cached.length > PAGE_SIZE);
      setLoading(false);
      return;
    }

    // Buscar en RadioBrowser
    let results = [];
    try {
      const rb = await axios.get(
        `${RB}/stations/search?name=${encodeURIComponent(name)}`,
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
      // ignorar; si no hay resultados debajo se manejará
    }

    if (results.length === 0) {
      setRadios([]);
      setHasMore(false);
      setError(`No se encontraron emisoras con el nombre "${name}".`);
      setLoading(false);
      return;
    }

    // Cache + paginación
    cacheRef.current.byName[name] = results;

    paginationRef.current = {
      country: null,
      allResults: results,
      currentPage: 1,
    };

    setRadios(results.slice(0, PAGE_SIZE));
    setHasMore(results.length > PAGE_SIZE);
    setLoading(false);
  }, []);

  // Scroll-infinito: agregar
  const fetchMoreByName = useCallback(() => {
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
    fetchMoreByName,
    clearRadios,
  };
}
