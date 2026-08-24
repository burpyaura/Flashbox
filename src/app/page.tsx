"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Clock3, Download, MoreVertical, Play, Search, Star, Tv, UserRound } from "lucide-react";
import { getAnime, getDetails, getPopularMovies, getPopularTv, getTopRatedMovies, getTrending, imageUrl, itemRuntime, itemTitle, itemType, itemYear, MediaType, TmdbItem } from "@/lib/tmdb";

type Selected = { id: number; type: MediaType };
const fallback = (label: string) => <div className="image-fallback">{label}</div>;

export default function Home() {
  const [tab, setTab] = useState("Home");
  const [nav, setNav] = useState(0);
  const [hero, setHero] = useState<TmdbItem[]>([]);
  const [popular, setPopular] = useState<TmdbItem[]>([]);
  const [continueItems, setContinueItems] = useState<TmdbItem[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [loading, setLoading] = useState(true);
  const [rowLoading, setRowLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => { getTrending().then(data => { const items = data.results.filter(item => item.media_type === "movie" || item.media_type === "tv").slice(0, 5); setHero(items); setContinueItems(items.slice(0, 4)); }).catch(() => setError(true)).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (!hero.length) return; const timer = window.setInterval(() => setHeroIndex(index => (index + 1) % hero.length), 5000); return () => window.clearInterval(timer); }, [hero.length]);
  useEffect(() => {
    setRowLoading(true);
    const request = tab === "Movies" ? getPopularMovies() : tab === "Anime" ? getAnime() : tab === "TV Shows" ? getPopularTv() : getTopRatedMovies();
    request.then(data => setPopular(data.results.slice(0, 12))).catch(() => setPopular([])).finally(() => setRowLoading(false));
  }, [tab]);

  if (selected) return <DetailsScreen selected={selected} onBack={() => setSelected(null)} />;
  const activeHero = hero[heroIndex];
  return <main className="shadow-app">
    <header className="topbar"><div className="brand"><span className="brand-mark"><Play fill="currentColor" /></span><b>SHADOW</b><b className="red"> PLAY</b></div><Search className="search" />
      <nav>{["Home", "Movies", "Anime", "TV Shows"].map(item => <button key={item} onClick={() => setTab(item)} className={tab === item ? "active" : ""}>{item}</button>)}</nav>
    </header>
    {error && <div className="api-error">TMDB is unavailable right now. Showing safe placeholders.</div>}
    {loading ? <HeroSkeleton /> : activeHero && <Hero item={activeHero} index={heroIndex} count={hero.length} onOpen={() => setSelected({ id: activeHero.id, type: itemType(activeHero) })} />}
    <SectionTitle title="Categories" />
    <div className="categories">{[["Anime", Star], ["Bollywood", Play], ["Hollywood", Star], ["TV Shows", Tv]].map(([label, Icon]: any) => <button className="category" key={label} onClick={() => setTab(label === "Anime" ? "Anime" : label === "TV Shows" ? "TV Shows" : "Movies")}><Icon fill="currentColor" /><span>{label}</span></button>)}</div>
    <SectionTitle title={tab === "Home" ? "Popular Movies" : tab} action="View All" />
    <div className="scroller">{rowLoading ? Array.from({ length: 6 }, (_, index) => <div className="movie skeleton" key={index} />) : popular.map(item => <MovieCard key={`${itemType(item)}-${item.id}`} item={item} onOpen={() => setSelected({ id: item.id, type: itemType(item) })} />)}</div>
    <SectionTitle title="Continue Watching" action="View All" />
    <div className="scroller">{continueItems.map((item, index) => <ContinueCard key={item.id} item={item} progress={[72, 58, 86, 74][index] ?? 40} onOpen={() => setSelected({ id: item.id, type: itemType(item) })} />)}</div>
    <footer>{[[Play, "Home"], [Clock3, "Recent Watch"], [Download, "Downloads"], [UserRound, "Profile"]].map(([Icon, label]: any, i) => <button key={label} onClick={() => setNav(i)} className={nav === i ? "nav-active" : ""}><Icon fill={i === 0 && nav === 0 ? "currentColor" : "none"} /><span>{label}</span></button>)}</footer>
  </main>;
}

function Hero({ item, index, count, onOpen }: { item: TmdbItem; index: number; count: number; onOpen: () => void }) { return <section className="hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(0,0,0,.97),rgba(0,0,0,.62) 48%,rgba(0,0,0,.18)),linear-gradient(0deg,rgba(0,0,0,.88),transparent 65%),url(${imageUrl(item.backdrop_path, "https://image.tmdb.org/t/p/w780") ?? ""})` }}><div className="hero-copy"><span className="eyebrow">TRENDING NOW</span><h1>{itemTitle(item)}</h1><h2>{itemYear(item) || "SEASON 2"}</h2><p>{item.overview || "Discover your next story from the shadows."}</p><button className="watch" onClick={onOpen}><Play size={14} fill="currentColor" /> Watch Now</button></div><div className="dots">{Array.from({ length: count }, (_, dot) => <i className={dot === index ? "selected" : ""} key={dot} />)}</div></section>; }
function HeroSkeleton() { return <section className="hero skeleton" aria-label="Loading trending content" />; }
function SectionTitle({ title, action }: { title: string; action?: string }) { return <div className="section-title"><h3>{title}</h3>{action && <button>{action}</button>}</div>; }
function ContinueCard({ item, progress, onOpen }: { item: TmdbItem; progress: number; onOpen: () => void }) { return <article className="continue-card" onClick={onOpen} style={{ backgroundImage: `linear-gradient(transparent 30%,#090909 100%),url(${imageUrl(item.poster_path) ?? ""})` }}><MoreVertical className="more" /><span className="play-ring"><Play fill="currentColor" /></span><div className="card-copy"><strong>{itemTitle(item)}</strong><small>{itemYear(item) || "S1 E1"}</small><span className="progress"><i style={{ width: `${progress}%` }} /></span></div></article>; }
function MovieCard({ item, onOpen }: { item: TmdbItem; onOpen: () => void }) { return <article className="movie" onClick={onOpen}>{imageUrl(item.poster_path) ? <img src={imageUrl(item.poster_path)!} alt="" /> : fallback(itemTitle(item))}<strong>{itemTitle(item)}</strong><small>{itemRuntime(item)}</small></article>; }

function DetailsScreen({ selected, onBack }: { selected: Selected; onBack: () => void }) {
  const [item, setItem] = useState<TmdbItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  useEffect(() => { getDetails(selected.id, selected.type).then(setItem).finally(() => setLoading(false)); }, [selected]);
  if (loading || !item) return <main className="details-page"><button className="details-back" onClick={onBack}><ArrowLeft size={20} /></button><div className="details-skeleton skeleton" /></main>;
  const genres = item.genres?.slice(0, 3) ?? [];
  return <main className="details-page" style={{ backgroundImage: `linear-gradient(#0c0c0ce6,#0c0c0c 42%),url(${imageUrl(item.backdrop_path, "https://image.tmdb.org/t/p/w780") ?? ""})` }}><header className="details-header"><button onClick={onBack}><ArrowLeft size={20} /></button><button onClick={() => setFavorite(value => !value)} className={favorite ? "saved" : ""}><Bookmark size={20} fill={favorite ? "currentColor" : "none"} /></button></header><div className="details-top">{imageUrl(item.poster_path) ? <img src={imageUrl(item.poster_path)!} alt="" /> : fallback(itemTitle(item))}<div><h1>{itemTitle(item)}</h1><p className="meta">{itemYear(item) || "—"} · ⭐ {item.vote_average?.toFixed(1) ?? "—"}/10</p><div className="genre-pills">{genres.map(genre => <span key={genre.id}>{genre.name}</span>)}</div></div></div><section className="overview"><h2>Overview</h2><p>{item.overview || "No synopsis is available for this title."}</p></section><button className="details-play"><Play size={16} fill="currentColor" /> PLAY {selected.type === "tv" ? "EPISODE" : "MOVIE"}</button><p className="tmdb-id">TMDB ID: {item.id} · IMDb ID: {item.imdb_id ?? item.external_ids?.imdb_id ?? "Not available"}</p></main>;
}
