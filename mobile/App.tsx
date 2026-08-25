import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { WebView } from "react-native-webview";

type MediaType = "movie" | "tv";
type Item = { id: number; media_type?: MediaType; title?: string; name?: string; overview?: string; poster_path?: string | null; backdrop_path?: string | null; release_date?: string; first_air_date?: string; vote_average?: number; genres?: { id: number; name: string }[] };
type Selection = { id: number; type: MediaType };
type StreamSource = { id: number; name: string; url: string };
const TMDB_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY ?? "";
const API = "https://api.themoviedb.org/3";
const IMAGE = "https://image.tmdb.org/t/p/w500";
const STREAM_API = process.env.EXPO_PUBLIC_STREAM_API_URL ?? "";
const title = (item: Item) => item.title ?? item.name ?? "Untitled";
const typeOf = (item: Item): MediaType => item.media_type === "tv" || item.first_air_date ? "tv" : "movie";
const year = (item: Item) => (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
async function tmdb<T>(path: string): Promise<T> { const response = await fetch(`${API}${path}${path.includes("?") ? "&" : "?"}api_key=${TMDB_KEY}`); if (!response.ok) throw new Error("TMDB request failed"); return response.json(); }
async function streams(selection: Selection): Promise<StreamSource[]> { if (!STREAM_API) return []; const response = await fetch(`${STREAM_API}?tmdbId=${selection.id}&type=${selection.type}`); if (!response.ok) return []; const data = await response.json() as { primaryStreamUrl?: string; fallbacks?: string[] }; return [data.primaryStreamUrl, ...(data.fallbacks ?? [])].filter((url): url is string => Boolean(url)).map((url, index) => ({ id: index, name: `Stream ${index + 1}`, url })); }

export default function App() {
  const [screen, setScreen] = useState<"home" | "search" | "watch">("home");
  const [selection, setSelection] = useState<Selection | null>(null);
  const open = (item: Item) => { setSelection({ id: item.id, type: typeOf(item) }); setScreen("watch"); };
  return <SafeAreaView style={styles.safe}><StatusBar style="light" />{screen === "home" && <Home onOpen={open} onSearch={() => setScreen("search")} />}{screen === "search" && <Search onBack={() => setScreen("home")} onOpen={open} />}{screen === "watch" && selection && <Watch selection={selection} onBack={() => setScreen("home")} onOpen={open} />}</SafeAreaView>;
}

function Home({ onOpen, onSearch }: { onOpen: (item: Item) => void; onSearch: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => { tmdb<{ results: Item[] }>("/trending/all/day").then(data => setItems(data.results.filter(item => item.poster_path).slice(0, 20))).catch(() => setItems([])); }, []);
  return <View style={styles.screen}><Header onSearch={onSearch} /><ScrollView><Text style={styles.heading}>Trending Now</Text><FlatList data={items} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} keyExtractor={item => `${typeOf(item)}-${item.id}`} renderItem={({ item }) => <Poster item={item} onPress={() => onOpen(item)} />} /><Text style={styles.heading}>Discover</Text><View style={styles.grid}>{items.slice(6).map(item => <Poster key={`${typeOf(item)}-${item.id}`} item={item} onPress={() => onOpen(item)} />)}</View></ScrollView></View>;
}

function Search({ onBack, onOpen }: { onBack: () => void; onOpen: (item: Item) => void }) {
  const [query, setQuery] = useState(""); const [results, setResults] = useState<Item[]>([]);
  useEffect(() => { if (!query.trim()) { setResults([]); return; } const timer = setTimeout(() => tmdb<{ results: Item[] }>(`/search/multi?query=${encodeURIComponent(query)}`).then(data => setResults(data.results.filter(item => item.media_type === "movie" || item.media_type === "tv"))).catch(() => setResults([])), 300); return () => clearTimeout(timer); }, [query]);
  return <View style={styles.screen}><View style={styles.searchHeader}><Pressable onPress={onBack}><Text style={styles.back}>‹</Text></Pressable><TextInput autoFocus value={query} onChangeText={setQuery} placeholder="Search movies and series" placeholderTextColor="#777" style={styles.input} /></View><FlatList data={results} keyExtractor={item => `${typeOf(item)}-${item.id}`} renderItem={({ item }) => <Pressable style={styles.result} onPress={() => onOpen(item)}>{item.poster_path && <Image source={{ uri: IMAGE + item.poster_path }} style={styles.resultImage} />}<View><Text style={styles.resultTitle}>{title(item)}</Text><Text style={styles.muted}>{year(item) || "Now streaming"}</Text></View></Pressable>} /></View>;
}

function Watch({ selection, onBack, onOpen }: { selection: Selection; onBack: () => void; onOpen: (item: Item) => void }) {
  const [item, setItem] = useState<Item | null>(null); const [sources, setSources] = useState<StreamSource[]>([]); const [sourceIndex, setSourceIndex] = useState(0); const [related, setRelated] = useState<Item[]>([]);
  useEffect(() => { setItem(null); setSourceIndex(0); Promise.all([tmdb<Item>(`/${selection.type}/${selection.id}?append_to_response=external_ids`), streams(selection), tmdb<{ results: Item[] }>(`/${selection.type}/${selection.id}/similar`)]).then(([details, available, similar]) => { setItem(details); setSources(available); setRelated((similar.results ?? []).slice(0, 12)); }).catch(() => setItem(null)); }, [selection]);
  if (!item) return <View style={styles.screen}><Pressable onPress={onBack}><Text style={styles.back}>‹ Home</Text></Pressable><View style={styles.loading}><ActivityIndicator color="#e50914" /></View></View>;
  const source = sources[sourceIndex];
  return <View style={styles.screen}><Pressable onPress={onBack}><Text style={styles.back}>‹ Home</Text></Pressable>{source ? <WebView key={source.id} source={{ uri: source.url }} style={styles.player} allowsFullscreenVideo mediaPlaybackRequiresUserAction={false} onError={() => sourceIndex + 1 < sources.length && setSourceIndex(index => index + 1)} /> : <View style={styles.player}><Text style={styles.muted}>Configure a stream API to enable playback.</Text></View>}<ScrollView><Text style={styles.kicker}>NOW WATCHING</Text><Text style={styles.watchTitle}>{title(item)}</Text><Text style={styles.meta}>{year(item) || "—"} · ⭐ {item.vote_average?.toFixed(1) ?? "—"}/10</Text><Text style={styles.section}>Overview</Text><Text style={styles.overview}>{item.overview || "No synopsis is available."}</Text><Text style={styles.section}>Recommended Movies</Text><FlatList data={related} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} keyExtractor={candidate => `${typeOf(candidate)}-${candidate.id}`} renderItem={({ item: candidate }) => <Poster item={candidate} onPress={() => onOpen(candidate)} />} /></ScrollView></View>;
}

function Header({ onSearch }: { onSearch: () => void }) { return <View style={styles.header}><Text style={styles.logo}>SHADOW <Text style={styles.red}>PLAY</Text></Text><Pressable onPress={onSearch}><Text style={styles.searchIcon}>⌕</Text></Pressable></View>; }
function Poster({ item, onPress }: { item: Item; onPress: () => void }) { return <Pressable style={styles.poster} onPress={onPress}>{item.poster_path ? <Image source={{ uri: IMAGE + item.poster_path }} style={styles.posterImage} /> : <View style={styles.posterImage} />}<Text numberOfLines={1} style={styles.posterTitle}>{title(item)}</Text><Text style={styles.muted}>{year(item) || "—"}</Text></Pressable>; }

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: "#090a0a" }, screen: { flex: 1, paddingHorizontal: 16, backgroundColor: "#090a0a" }, header: { height: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, logo: { color: "#fff", fontSize: 19, fontWeight: "800", letterSpacing: 1 }, red: { color: "#e50914" }, searchIcon: { color: "#fff", fontSize: 28 }, heading: { color: "#fff", fontSize: 18, fontWeight: "700", marginVertical: 14 }, row: { gap: 12, paddingBottom: 12 }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingBottom: 30 }, poster: { width: 112 }, posterImage: { width: 112, height: 168, borderRadius: 7, backgroundColor: "#1b1d1c" }, posterTitle: { color: "#fff", fontSize: 12, fontWeight: "600", marginTop: 6 }, muted: { color: "#8b9290", fontSize: 11, marginTop: 3 }, searchHeader: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12 }, back: { color: "#fff", fontSize: 17 }, input: { flex: 1, height: 42, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "#171918", color: "#fff", fontSize: 14 }, result: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: "#202321" }, resultImage: { width: 42, height: 62, borderRadius: 5 }, resultTitle: { color: "#fff", fontSize: 14, fontWeight: "600" }, loading: { height: 210, alignItems: "center", justifyContent: "center" }, player: { width: "100%", height: 220, marginVertical: 12, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }, kicker: { color: "#e50914", fontSize: 10, fontWeight: "700", letterSpacing: 1, marginTop: 8 }, watchTitle: { color: "#fff", fontSize: 25, fontWeight: "800", marginTop: 4 }, meta: { color: "#aaa", fontSize: 12, marginTop: 7 }, section: { color: "#fff", fontSize: 17, fontWeight: "700", marginTop: 22, marginBottom: 8 }, overview: { color: "#bbb", fontSize: 13, lineHeight: 20 }
});
