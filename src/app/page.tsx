"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bookmark, Clock3, Download, MoreVertical, Play, Search, Star, Tv, UserRound, X, Trash2, ArrowRight } from "lucide-react";
import { getActionMovies, getAnime, getBollywood, getDetails, getGlobalTrending, getHollywood, getPopularAnime, getPopularTv, getTopRatedMovies, getTrending, getTrendingTv, imageUrl, itemRuntime, itemTitle, itemType, itemYear, MediaType, searchTmdb, TmdbItem } from "@/lib/tmdb";

type Selected = { id: number; type: MediaType };
type FeedSection = { title: string; items: TmdbItem[] };
const fallback = (label: string) => <div className="image-fallback">{label}</div>;

export default function Home() {
  const [tab, setTab] = useState("Home");
  const [nav, setNav] = useState(0);
  const [hero, setHero] = useState<HeroItem[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [feedSections, setFeedSections] = useState<FeedSection[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const feedLock = useRef(false);
  const feedPageRef = useRef(0);
  const feedHasMoreRef = useRef(true);
  const feedSentinel = useRef<HTMLDivElement | null>(null);
  const homeScrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => { Promise.all([getBollywood(1), getAnime(1)]).then(([bollywood, anime]) => { const latestBollywood = (bollywood.results ?? []).slice(0, 3).map(item => ({ ...item, heroLabel: "LATEST BOLLYWOOD" as const })); const popularAnime = (anime.results ?? []).slice(0, 3).map(item => ({ ...item, media_type: "tv" as const, heroLabel: "POPULAR ANIME" as const })); const items = latestBollywood.flatMap((item, index) => popularAnime[index] ? [item, popularAnime[index]] : [item]); setHero(items); }).catch(() => setError(true)).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (!hero.length) return; const timer = window.setInterval(() => setHeroIndex(index => (index + 1) % hero.length), 4000); return () => window.clearInterval(timer); }, [hero.length]);
  const fetchNextPage = () => {
    if (feedLock.current || !feedHasMoreRef.current) return;
    feedLock.current = true; setFeedLoading(true);
    const nextPage = feedPageRef.current + 1;
    const request = nextPage === 1 ? Promise.all([getBollywood(1), getPopularAnime(1), getHollywood(1)]).then(([bollywood, anime, hollywood]) => [
      { title: "Bollywood Movies", items: bollywood.results ?? [] },
      { title: "Trending Anime", items: (anime.results ?? []).map(item => ({ ...item, media_type: "tv" as const })) },
      { title: "Hollywood Blockbusters", items: hollywood.results ?? [] },
    ]) : nextPage === 2 ? Promise.all([getTopRatedMovies(nextPage), getTrendingTv(nextPage), getActionMovies(nextPage)]).then(([classics, web, action]) => [
      { title: "Top Rated South Dubbed", items: classics.results ?? [] },
      { title: "Trending Web Series", items: (web.results ?? []).map(item => ({ ...item, media_type: "tv" as const })) },
      { title: "Action Thrillers", items: action.results ?? [] },
    ]) : Promise.all([getBollywood(nextPage), getPopularAnime(nextPage), getPopularTv(nextPage), getGlobalTrending(nextPage)]).then(([hindi, anime, shows, global]) => [
      { title: "Popular Classic Hindi Movies", items: hindi.results ?? [] },
      { title: "Anime Movies", items: (anime.results ?? []).map(item => ({ ...item, media_type: "tv" as const })) },
      { title: "Blockbuster Hit Shows", items: (shows.results ?? []).map(item => ({ ...item, media_type: "tv" as const })) },
      { title: "Global Trending", items: (global.results ?? []).filter(item => item.media_type === "movie" || item.media_type === "tv") },
    ]);
    request.then(rawBatch => {
      const batch: FeedSection[] = rawBatch.map(section => ({ ...section, items: section.items.filter((item, index, self) => index === self.findIndex(candidate => candidate.id === item.id)) }));
      setFeedSections(current => current.length ? current.map((section, index) => {
        const newItems = batch[index]?.items ?? [];
        const uniqueItems = newItems.filter((item, itemIndex, self) => itemIndex === self.findIndex(candidate => candidate.id === item.id));
        const existingIds = new Set(section.items.map(item => item.id));
        return { ...section, items: [...section.items, ...uniqueItems.filter(item => !existingIds.has(item.id))] };
      }) : batch);
      feedPageRef.current = nextPage;
      const more = batch.some(section => section.items.length > 0);
      feedHasMoreRef.current = more;
    }).catch(() => { feedHasMoreRef.current = false; }).finally(() => { feedLock.current = false; setFeedLoading(false); });
  };
  useEffect(() => { fetchNextPage(); }, []);
  useEffect(() => { const sentinel = feedSentinel.current; const scrollRoot = homeScrollRef.current; if (!sentinel || !scrollRoot) return; const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) fetchNextPage(); }, { root: scrollRoot, rootMargin: "700px 0px" }); observer.observe(sentinel); return () => observer.disconnect(); }, []);
  if (selected) return <DetailsScreen selected={selected} onBack={() => setSelected(null)} />;
  if (searchOpen) return <SearchScreen onClose={() => setSearchOpen(false)} onOpen={setSelected} />;
  const activeHero = hero[heroIndex];
  return <main ref={homeScrollRef} className="shadow-app" onScroll={event => { const target = event.currentTarget; const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 200; if (bottom && !feedLoading) fetchNextPage(); }}>
    <header className="topbar"><div className="brand"><span className="brand-mark"><Play fill="currentColor" /></span><b>SHADOW</b><b className="red"> PLAY</b></div><button className="search-button" onClick={() => setSearchOpen(value => !value)} aria-label="Search">{searchOpen ? <X className="search" /> : <Search className="search" />}</button>
      <nav>{["Home", "Movies", "Anime", "TV Shows", "Bollywood"].map(item => <button key={item} onClick={() => setTab(item)} className={tab === item ? "active" : ""}>{item}</button>)}</nav>
    </header>
    {error && <div className="api-error">TMDB is unavailable right now. Showing safe placeholders.</div>}
    {loading ? <HeroSkeleton /> : activeHero && <Hero item={activeHero} index={heroIndex} count={hero.length} onOpen={() => setSelected({ id: activeHero.id, type: itemType(activeHero) })} />}
    <SectionTitle title="Categories" />
    <div className="categories">{[["Anime", Star], ["Bollywood", Play], ["Hollywood", Star], ["TV Shows", Tv]].map(([label, Icon]: any) => <button className="category" key={label} onClick={() => setTab(label === "Anime" ? "Anime" : label === "Bollywood" ? "Bollywood" : label === "TV Shows" ? "TV Shows" : "Movies")}><Icon fill="currentColor" /><span>{label}</span></button>)}</div>
     <div className="infinite-feed">{feedSections.map(section => <section className="feed-section" key={section.title}><SectionTitle title={section.title} action="View All" /><div className="scroller">{section.items.map((item, index) => <MovieCard key={`${section.title}-${item.id}-${index}`} item={item} onOpen={() => setSelected({ id: item.id, type: itemType(item) })} />)}</div></section>)}</div>
      <div id="scroll-sentinel" ref={feedSentinel} className="feed-sentinel" aria-hidden="true" />
      {feedLoading && <div className="feed-loader" aria-label="Loading more content"><span className="spinner" /></div>}
      <button className="load-more-button" onClick={fetchNextPage} disabled={feedLoading}>{feedLoading ? "Loading Movies..." : "Load More Movies"}</button>
      <footer>{[[Play, "Home"], [Clock3, "Recent Watch"], [Download, "Downloads"], [UserRound, "Profile"]].map(([Icon, label]: any, i) => <button key={label} onClick={() => setNav(i)} className={nav === i ? "nav-active" : ""}><Icon fill={i === 0 && nav === 0 ? "currentColor" : "none"} /><span>{label}</span></button>)}</footer>
  </main>;
}

type HeroItem = TmdbItem & { heroLabel: "LATEST BOLLYWOOD" | "POPULAR ANIME" };
function Hero({ item, index, count, onOpen }: { item: HeroItem; index: number; count: number; onOpen: () => void }) { const heroImage = imageUrl(item.backdrop_path, "https://image.tmdb.org/t/p/original") ?? imageUrl(item.poster_path, "https://image.tmdb.org/t/p/original"); return <section className="hero" onClick={onOpen}><div className="hero-image">{heroImage ? <img src={heroImage} alt={`${itemTitle(item)} backdrop`} /> : <div className="hero-image-fallback">{itemTitle(item)}</div>}</div><div className="hero-content"><div className="hero-meta"><span className="eyebrow hero-badge">{item.heroLabel}</span><span className="hero-year">{itemYear(item) || "COMING SOON"}</span></div><h1>{itemTitle(item)}</h1><p>{item.overview || "Discover your next story from the shadows."}</p><div className="hero-bottom"><button className="watch" onClick={event => { event.stopPropagation(); onOpen(); }}><Play size={14} fill="currentColor" /> Watch Now</button><div className="dots" aria-label={`Slide ${index + 1} of ${count}`}>{Array.from({ length: count }, (_, dot) => <i className={dot === index ? "selected" : ""} key={dot} />)}</div></div></div></section>; }
function HeroSkeleton() { return <section className="hero skeleton" aria-label="Loading trending content" />; }
function SectionTitle({ title, action }: { title: string; action?: string }) { return <div className="section-title"><h3>{title}</h3>{action && <button>{action}</button>}</div>; }
function ContinueCard({ item, progress, onOpen }: { item: TmdbItem; progress: number; onOpen: () => void }) { return <article className="continue-card" onClick={onOpen} style={{ backgroundImage: `linear-gradient(transparent 30%,#090909 100%),url(${imageUrl(item.poster_path) ?? ""})` }}><MoreVertical className="more" /><span className="play-ring"><Play fill="currentColor" /></span><div className="card-copy"><strong>{itemTitle(item)}</strong><small>{itemYear(item) || "S1 E1"}</small><span className="progress"><i style={{ width: `${progress}%` }} /></span></div></article>; }
function MovieCard({ item, onOpen }: { item: TmdbItem; onOpen: () => void }) { return <article className="movie" onClick={onOpen}>{imageUrl(item.poster_path) ? <img src={imageUrl(item.poster_path)!} alt="" /> : fallback(itemTitle(item))}<strong>{itemTitle(item)}</strong><small>{itemRuntime(item)}</small></article>; }

function SearchScreen({ onClose, onOpen }: { onClose: () => void; onOpen: (selected: Selected) => void }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<TmdbItem[]>([]);
  const [ranked, setRanked] = useState<TmdbItem[]>([]);
  const [trending, setTrending] = useState<TmdbItem[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [category, setCategory] = useState("Movie");
  const [loading, setLoading] = useState(false);
  useEffect(() => { try { const stored: unknown = JSON.parse(localStorage.getItem("shadow-play-recent") ?? "[]"); setRecent(Array.isArray(stored) ? stored.filter((value): value is string => typeof value === "string") : []); } catch { setRecent([]); } getTrending().then(data => { const items = (data.results ?? []).filter(item => item.media_type === "movie" || item.media_type === "tv"); setTrending(items.slice(0, 10)); setRanked(items.slice(0, 12)); }).catch(() => { setTrending([]); setRanked([]); }); }, []);
  useEffect(() => { if (!query.trim()) { setSuggestions([]); setLoading(false); return; } const timer = window.setTimeout(() => { setLoading(true); searchTmdb(query.trim()).then(data => setSuggestions(data.results.filter(item => item.media_type === "movie" || item.media_type === "tv").slice(0, 8))).catch(() => setSuggestions([])).finally(() => setLoading(false)); }, 300); return () => window.clearTimeout(timer); }, [query]);
  const open = (item: TmdbItem) => { const value = itemTitle(item); const next = [value, ...recent.filter(entry => entry.toLowerCase() !== value.toLowerCase())].slice(0, 8); setRecent(next); localStorage.setItem("shadow-play-recent", JSON.stringify(next)); onOpen({ id: item.id, type: itemType(item) }); };
  const selectRecent = (value: string) => { setQuery(value); };
  const tabs = ["Movie", "Series", "Short TV", "Anime"];
  const filteredRanked = ranked.filter(item => category === "Movie" ? itemType(item) === "movie" : category === "Anime" ? item.genre_ids?.includes(16) : itemType(item) === "tv");
  const executeSearch = () => { if (suggestions[0]) open(suggestions[0]); else if (query.trim()) { const value = query.trim(); setRecent([value, ...recent.filter(entry => entry.toLowerCase() !== value.toLowerCase())].slice(0, 8)); localStorage.setItem("shadow-play-recent", JSON.stringify([value, ...recent.filter(entry => entry.toLowerCase() !== value.toLowerCase())].slice(0, 8))); } };
  return <main className="search-screen"><header className="search-screen-header"><button className="search-back" onClick={onClose} aria-label="Close search"><ArrowLeft size={19} /></button><div className="search-field"><Search size={17} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => event.key === "Enter" && executeSearch()} placeholder="Search movies, series, anime..." /><button className="clear-search" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button></div><button className="search-submit" onClick={executeSearch}>Search</button></header>
    {!query.trim() && <><section className="search-section"><div className="search-section-title"><h2>Recent</h2>{recent.length > 0 && <button onClick={() => { setRecent([]); localStorage.removeItem("shadow-play-recent"); }}><Trash2 size={14} /> Clear</button>}</div><div className="search-chips">{recent.length ? recent.map(value => <button key={value} onClick={() => selectRecent(value)}>{value}</button>) : <span className="empty-search">Your recent searches will appear here.</span>}</div></section><section className="search-section trending-section"><h2>🔥 Everyone is searching</h2><div className="search-chips">{trending.map(item => <button key={`${itemType(item)}-${item.id}`} onClick={() => selectRecent(itemTitle(item))}>{itemTitle(item)}</button>)}</div></section></>}
    {query.trim() ? <section className="suggestion-view">{loading ? <><div className="suggestion-loading skeleton" /><div className="suggestion-loading-row skeleton" /><div className="suggestion-loading-row skeleton" /></> : suggestions.length ? <><button className="featured-search" onClick={() => open(suggestions[0])}>{imageUrl(suggestions[0].poster_path) ? <img src={imageUrl(suggestions[0].poster_path)!} alt="" /> : fallback(itemTitle(suggestions[0]))}<span><small>TOP MATCH</small><strong>{highlight(itemTitle(suggestions[0]), query)}</strong><em>{itemYear(suggestions[0]) || "Now streaming"}</em></span><ArrowRight size={18} /></button><div className="suggestion-list">{suggestions.slice(1).map(item => <button key={`${itemType(item)}-${item.id}`} onClick={() => open(item)}><Search size={15} /><span>{highlight(itemTitle(item), query)}</span><small>{itemYear(item)}</small></button>)}</div></> : <span className="search-status">No matches found on TMDB.</span>}</section> : <section className="search-section ranked-section"><h2>Ranked for you</h2><div className="ranked-tabs">{tabs.map(tab => <button key={tab} onClick={() => setCategory(tab)} className={category === tab ? "active" : ""}>{tab}</button>)}</div><div className="ranked-list">{filteredRanked.map((item, index) => <button className="ranked-item" key={`${itemType(item)}-${item.id}`} onClick={() => open(item)}><b>{index + 1}</b>{imageUrl(item.poster_path) ? <img src={imageUrl(item.poster_path)!} alt="" /> : <span className="result-fallback" />}<span><strong>{itemTitle(item)}</strong><small>⭐ {item.vote_average?.toFixed(1) ?? "—"} · {itemYear(item) || "—"}</small><small>{itemType(item) === "tv" ? "Series" : "Movie"} · {item.origin_country?.[0] ?? "Global"} · {genreName(item.genre_ids)}</small></span></button>)}</div></section>}
  </main>;
}

function highlight(value: string, query: string) { const index = value.toLowerCase().indexOf(query.toLowerCase()); if (index < 0) return value; return <>{value.slice(0, index)}<mark>{value.slice(index, index + query.length)}</mark>{value.slice(index + query.length)}</>; }
function genreName(ids?: number[]) { const names: Record<number, string> = { 16: "Animation", 28: "Action", 35: "Comedy", 18: "Drama", 27: "Horror", 878: "Sci-Fi", 10749: "Romance" }; return ids?.map(id => names[id]).filter(Boolean).slice(0, 1).join("") || "Featured"; }

function DetailsScreen({ selected, onBack }: { selected: Selected; onBack: () => void }) {
  const [item, setItem] = useState<TmdbItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  useEffect(() => { getDetails(selected.id, selected.type).then(setItem).finally(() => setLoading(false)); }, [selected]);
  if (loading || !item) return <main className="details-page"><button className="details-back" onClick={onBack}><ArrowLeft size={20} /></button><div className="details-skeleton skeleton" /></main>;
  const genres = item.genres?.slice(0, 3) ?? [];
  return <main className="details-page" style={{ backgroundImage: `linear-gradient(#0c0c0ce6,#0c0c0c 42%),url(${imageUrl(item.backdrop_path, "https://image.tmdb.org/t/p/w780") ?? ""})` }}><header className="details-header"><button onClick={onBack}><ArrowLeft size={20} /></button><button onClick={() => setFavorite(value => !value)} className={favorite ? "saved" : ""}><Bookmark size={20} fill={favorite ? "currentColor" : "none"} /></button></header><div className="details-top">{imageUrl(item.poster_path) ? <img src={imageUrl(item.poster_path)!} alt="" /> : fallback(itemTitle(item))}<div><h1>{itemTitle(item)}</h1><p className="meta">{itemYear(item) || "—"} · ⭐ {item.vote_average?.toFixed(1) ?? "—"}/10</p><div className="genre-pills">{genres.map(genre => <span key={genre.id}>{genre.name}</span>)}</div></div></div><section className="overview"><h2>Overview</h2><p>{item.overview || "No synopsis is available for this title."}</p></section><button className="details-play"><Play size={16} fill="currentColor" /> PLAY {selected.type === "tv" ? "EPISODE" : "MOVIE"}</button><p className="tmdb-id">TMDB ID: {item.id} · IMDb ID: {item.imdb_id ?? item.external_ids?.imdb_id ?? "Not available"}</p></main>;
}
