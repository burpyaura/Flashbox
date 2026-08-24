"use client";

import { useState } from "react";
import { Clock3, Download, MoreVertical, Play, Search, Star, Tv, UserRound } from "lucide-react";

const continueItems = [
  ["Jujutsu Kaisen", "S2 E15", "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=700", "72%"],
  ["K.G.F: Chapter 2", "2h 48m", "https://images.unsplash.com/photo-1607604276583-eef5c071ddf8?w=700", "58%"],
  ["Avengers: Endgame", "3h 1m", "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=700", "86%"],
  ["Demon Slayer", "S3 E7", "https://images.unsplash.com/photo-1541560052-77ec1bbc09f7?w=700", "74%"],
];
const movies = [
  ["Inception", "2h 28m", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=700"],
  ["3 Idiots", "2h 50m", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700"],
  ["Your Name.", "1h 46m", "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=700"],
  ["Interstellar", "2h 49m", "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=700"],
  ["Spirited Away", "2h 04m", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=700"],
];

export default function Home() {
  const [tab, setTab] = useState("Home");
  const [nav, setNav] = useState(0);
  return <main className="shadow-app">
    <header className="topbar">
      <div className="brand"><span className="brand-mark"><Play fill="currentColor" /></span><b>SHADOW</b><b className="red"> PLAY</b></div><Search className="search" />
      <nav>{["Home", "Movies", "Anime", "TV Shows"].map(item => <button key={item} onClick={() => setTab(item)} className={tab === item ? "active" : ""}>{item}</button>)}</nav>
    </header>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">TRENDING NOW</span><h1>SOLO LEVELING</h1><h2>SEASON 2</h2><p>The hunter becomes the<br />shadow monarch.</p><button className="watch"><Play size={20} fill="currentColor" /> Watch Now</button></div><div className="dots"><i className="selected" />{[1,2,3,4,5].map(i => <i key={i} />)}</div>
    </section>
    <SectionTitle title="Categories" />
    <div className="categories">{[["Anime", Star], ["Bollywood", Play], ["Hollywood", Star], ["TV Shows", Tv]].map(([label, Icon]: any) => <button className="category" key={label}><Icon fill="currentColor" /><span>{label}</span></button>)}</div>
    <SectionTitle title="Continue Watching" action="View All" />
    <div className="scroller">{continueItems.map(([title, meta, image, progress]) => <article className="continue-card" key={title} style={{ backgroundImage: `linear-gradient(transparent 30%, #090909 100%), url(${image})` }}><MoreVertical className="more" /><span className="play-ring"><Play fill="currentColor" /></span><div className="card-copy"><strong>{title}</strong><small>{meta}</small><span className="progress"><i style={{ width: progress }} /></span></div></article>)}</div>
    <SectionTitle title="Popular Movies" action="View All" />
    <div className="scroller movie-row">{movies.map(([title, meta, image]) => <article className="movie" key={title}><img src={image} alt="" /><strong>{title}</strong><small>{meta}</small></article>)}</div>
    <footer>{[[Play, "Home"], [Clock3, "Recent Watch"], [Download, "Downloads"], [UserRound, "Profile"]].map(([Icon, label]: any, i) => <button key={label} onClick={() => setNav(i)} className={nav === i ? "nav-active" : ""}><Icon fill={i === 0 && nav === 0 ? "currentColor" : "none"} /><span>{label}</span></button>)}</footer>
  </main>;
}

function SectionTitle({ title, action }: { title: string; action?: string }) { return <div className="section-title"><h3>{title}</h3>{action && <button>{action}</button>}</div>; }
