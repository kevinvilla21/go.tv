import { useState, useRef, useEffect } from "react";

const ACCENT = "#E8001C";
const BG = "#0D0203";
const CARD = "#160405";
const BORDER = "#2A0608";
const ACCENT_SOFT = "rgba(232,0,28,0.1)";
const ACCENT_GLOW = "rgba(232,0,28,0.3)";
const TEXT = "#F5E6E7";
const MUTED = "#6B3035";
const MUTED_LIGHT = "#9B5055";

// Cada canal tiene su stream. En produccion reemplaza las URLs con streams reales de cada canal.
const CHANNELS = [
  { id:1,  name:"Azteca",        tag:"AZT", country:"🇲🇽", url:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id:2,  name:"VIX",           tag:"VIX", country:"🇲🇽", url:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id:3,  name:"Televisa",      tag:"TEL", country:"🇲🇽", url:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id:4,  name:"ESPN",          tag:"ESP", country:"🌎",  url:"https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8" },
  { id:5,  name:"Fox Sports",    tag:"FOX", country:"🌎",  url:"https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8" },
  { id:6,  name:"TyC Sports",    tag:"TYC", country:"🇦🇷", url:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id:7,  name:"Globo",         tag:"GLB", country:"🇧🇷", url:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id:8,  name:"beIN Sports",   tag:"BIN", country:"🌍",  url:"https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8" },
  { id:9,  name:"TSN",           tag:"TSN", country:"🇨🇦", url:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id:10, name:"Mediaset",      tag:"MED", country:"🇪🇸", url:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id:11, name:"TF1",           tag:"TF1", country:"🇫🇷", url:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id:12, name:"RAI",           tag:"RAI", country:"🇮🇹", url:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { id:13, name:"Demo HD",       tag:"DMO", country:"🎬",  url:"https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
];

// channelId apunta al id del canal de arriba
const FIXTURE = [
  { id:1,  date:"11 Jun", time:"13:00", homeName:"Mexico",        homeFlag:"🇲🇽", awayName:"Sudafrica",     awayFlag:"🇿🇦", group:"A", city:"Ciudad de Mexico", channelId:1,  channelLabel:"Azteca / VIX" },
  { id:2,  date:"11 Jun", time:"20:00", homeName:"Corea del Sur", homeFlag:"🇰🇷", awayName:"Rep. Checa",    awayFlag:"🇨🇿", group:"A", city:"Zapopan",          channelId:3,  channelLabel:"Televisa / ESPN" },
  { id:3,  date:"12 Jun", time:"13:00", homeName:"Canada",        homeFlag:"🇨🇦", awayName:"Rep.Europeo A", awayFlag:"🏳️", group:"B", city:"Toronto",          channelId:9,  channelLabel:"TSN / ESPN" },
  { id:4,  date:"12 Jun", time:"19:00", homeName:"Estados Unidos",homeFlag:"🇺🇸", awayName:"Paraguay",      awayFlag:"🇵🇾", group:"D", city:"Los Angeles",      channelId:5,  channelLabel:"Fox Sports / ESPN" },
  { id:5,  date:"13 Jun", time:"13:00", homeName:"Qatar",         homeFlag:"🇶🇦", awayName:"Suiza",         awayFlag:"🇨🇭", group:"B", city:"Santa Clara",      channelId:8,  channelLabel:"beIN / ESPN" },
  { id:6,  date:"13 Jun", time:"16:00", homeName:"Brasil",        homeFlag:"🇧🇷", awayName:"Marruecos",     awayFlag:"🇲🇦", group:"C", city:"New Jersey",       channelId:7,  channelLabel:"Globo / ESPN" },
  { id:7,  date:"13 Jun", time:"19:00", homeName:"Haiti",         homeFlag:"🇭🇹", awayName:"Escocia",       awayFlag:"🏴", group:"C", city:"Foxborough",       channelId:4,  channelLabel:"ESPN / BBC" },
  { id:8,  date:"14 Jun", time:"13:00", homeName:"Argentina",     homeFlag:"🇦🇷", awayName:"Albania",       awayFlag:"🇦🇱", group:"E", city:"New Jersey",       channelId:6,  channelLabel:"TyC / ESPN" },
  { id:9,  date:"14 Jun", time:"16:00", homeName:"España",        homeFlag:"🇪🇸", awayName:"Bolivia",       awayFlag:"🇧🇴", group:"F", city:"Pasadena",         channelId:10, channelLabel:"Mediaset / ESPN" },
  { id:10, date:"14 Jun", time:"19:00", homeName:"Francia",       homeFlag:"🇫🇷", awayName:"Arabia Saud.",  awayFlag:"🇸🇦", group:"G", city:"Dallas",           channelId:11, channelLabel:"TF1 / ESPN" },
  { id:11, date:"15 Jun", time:"10:00", homeName:"Alemania",      homeFlag:"🇩🇪", awayName:"Colombia",      awayFlag:"🇨🇴", group:"H", city:"Filadelfia",       channelId:4,  channelLabel:"ARD / ESPN" },
  { id:12, date:"15 Jun", time:"13:00", homeName:"Uruguay",       homeFlag:"🇺🇾", awayName:"Portugal",      awayFlag:"🇵🇹", group:"I", city:"Ciudad de Mexico", channelId:2,  channelLabel:"VIX / RTP" },
  { id:13, date:"15 Jun", time:"16:00", homeName:"Inglaterra",    homeFlag:"🏴", awayName:"Senegal",       awayFlag:"🇸🇳", group:"J", city:"Orlando",          channelId:8,  channelLabel:"ITV / beIN" },
  { id:14, date:"15 Jun", time:"19:00", homeName:"P. Bajos",      homeFlag:"🇳🇱", awayName:"Japon",         awayFlag:"🇯🇵", group:"K", city:"Charlotte",        channelId:4,  channelLabel:"NOS / ESPN" },
  { id:15, date:"16 Jun", time:"13:00", homeName:"Italia",        homeFlag:"🇮🇹", awayName:"Ecuador",       awayFlag:"🇪🇨", group:"L", city:"Miami",            channelId:12, channelLabel:"RAI / ESPN" },
  { id:16, date:"16 Jun", time:"16:00", homeName:"Belgica",       homeFlag:"🇧🇪", awayName:"Peru",          awayFlag:"🇵🇪", group:"E", city:"Kansas City",      channelId:4,  channelLabel:"RTBF / ESPN" },
  { id:17, date:"16 Jun", time:"19:00", homeName:"Croacia",       homeFlag:"🇭🇷", awayName:"Chile",         awayFlag:"🇨🇱", group:"F", city:"Seattle",          channelId:4,  channelLabel:"HRT / ESPN" },
];

const DAYS = ["Todos", "11 Jun", "12 Jun", "13 Jun", "14 Jun", "15 Jun", "16 Jun"];

export default function GoTV() {
  const [tab, setTab] = useState("fixture");
  const [dayFilter, setDayFilter] = useState("Todos");
  const [activeChannel, setActiveChannel] = useState(null);
  const [watchingMatch, setWatchingMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [hlsLoaded, setHlsLoaded] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(function() {
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js";
    script.onload = function() { setHlsLoaded(true); };
    document.head.appendChild(script);
    return function() { if (hlsRef.current) hlsRef.current.destroy(); };
  }, []);

  function loadStream(channel) {
    if (!videoRef.current || !hlsLoaded) return;
    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    var Hls = window.Hls;
    if (Hls && Hls.isSupported()) {
      var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        videoRef.current.play().catch(function() {});
        setIsLoading(false);
        setIsPlaying(true);
      });
      hls.on(Hls.Events.ERROR, function(e, d) {
        if (d.fatal) { setIsLoading(false); setError("Stream no disponible ahora. Es una demo — agrega URLs reales de cada canal."); }
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = channel.url;
      videoRef.current.play()
        .then(function() { setIsLoading(false); setIsPlaying(true); })
        .catch(function() { setIsLoading(false); setError("No se pudo reproducir."); });
    }
  }

  function handleWatchMatch(match) {
    var ch = CHANNELS.find(function(c) { return c.id === match.channelId; });
    if (!ch) return;
    setWatchingMatch(match);
    setActiveChannel(ch);
    setTab("player");
    setTimeout(function() { loadStream(ch); }, 200);
  }

  function handleSelectChannel(ch) {
    setActiveChannel(ch);
    setWatchingMatch(null);
    setTab("player");
    setTimeout(function() { loadStream(ch); }, 200);
  }

  useEffect(function() {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  var filteredFixture = dayFilter === "Todos"
    ? FIXTURE
    : FIXTURE.filter(function(m) { return m.date === dayFilter; });

  // ── PLAYER VIEW ──────────────────────────────────────────────
  function PlayerView() {
    return (
      <div style={{ padding:"16px 20px", maxWidth:900, margin:"0 auto" }}>

        {/* Back button */}
        <button onClick={function() { setTab("fixture"); }} style={{ background:"none", border:"1px solid " + BORDER, color:MUTED, borderRadius:6, padding:"6px 14px", fontSize:12, cursor:"pointer", marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
          ← Volver al Fixture
        </button>

        {/* Match header if coming from fixture */}
        {watchingMatch && (
          <div style={{ background:CARD, border:"1px solid " + ACCENT, borderRadius:12, padding:"14px 18px", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:28 }}>{watchingMatch.homeFlag}</span>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, color:ACCENT, fontWeight:700, letterSpacing:1 }}>GRUPO {watchingMatch.group} · {watchingMatch.date} {watchingMatch.time}</div>
                <div style={{ fontSize:13, color:MUTED, marginTop:2 }}>{watchingMatch.city}</div>
              </div>
              <span style={{ fontSize:28 }}>{watchingMatch.awayFlag}</span>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12, fontWeight:700, color:TEXT }}>{watchingMatch.homeName} vs {watchingMatch.awayName}</div>
              <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>📺 {watchingMatch.channelLabel}</div>
            </div>
          </div>
        )}

        {/* Video player */}
        <div style={{ position:"relative", background:"#000", borderRadius:14, overflow:"hidden", aspectRatio:"16/9", border:"1px solid " + (isPlaying ? ACCENT : BORDER), boxShadow: isPlaying ? "0 0 30px " + ACCENT_GLOW : "none", transition:"all 0.5s", maxHeight:420 }}>

          <video ref={videoRef} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} playsInline />

          {isLoading && (
            <div style={{ position:"absolute", inset:0, zIndex:5, background:"rgba(0,0,0,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
              <div style={{ width:48, height:48, borderRadius:"50%", border:"3px solid " + BORDER, borderTop:"3px solid " + ACCENT, animation:"spin 0.8s linear infinite" }} />
              <div style={{ fontSize:13, color:MUTED }}>Conectando a {activeChannel ? activeChannel.name : "canal"}...</div>
            </div>
          )}

          {!isLoading && !isPlaying && !error && activeChannel && (
            <div style={{ position:"absolute", inset:0, zIndex:5, background:"radial-gradient(ellipse at center,#1A0305 0%,#0A0102 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 }}>
              {watchingMatch && (
                <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:6 }}>
                  <span style={{ fontSize:44 }}>{watchingMatch.homeFlag}</span>
                  <span style={{ fontSize:16, color:MUTED, fontWeight:700 }}>vs</span>
                  <span style={{ fontSize:44 }}>{watchingMatch.awayFlag}</span>
                </div>
              )}
              <button onClick={function() { loadStream(activeChannel); }} style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg," + ACCENT + ",#FF4455)", border:"none", cursor:"pointer", fontSize:24, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 28px " + ACCENT_GLOW }}>▶</button>
              <div style={{ fontSize:13, color:MUTED }}>Reproducir en {activeChannel.name}</div>
            </div>
          )}

          {error && !isLoading && (
            <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:6, background:"rgba(13,2,3,0.95)", padding:"12px 16px", borderTop:"1px solid " + BORDER }}>
              <div style={{ fontSize:12, color:"#FF8888", marginBottom:6 }}>⚠️ {error}</div>
              <div style={{ fontSize:11, color:MUTED }}>Para ver partidos reales necesitas agregar las URLs M3U8 de cada canal en el codigo.</div>
            </div>
          )}

          {/* Channel badge */}
          {activeChannel && (
            <div style={{ position:"absolute", top:10, left:10, zIndex:4, background:"rgba(0,0,0,0.8)", borderRadius:6, padding:"4px 10px", display:"flex", alignItems:"center", gap:6, border:"1px solid " + BORDER }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:ACCENT, display:"inline-block", boxShadow:"0 0 6px " + ACCENT, animation:"pulse 1.5s infinite" }} />
              <span style={{ fontSize:11, fontWeight:700 }}>{activeChannel.country} {activeChannel.name}</span>
            </div>
          )}

          {/* Controls */}
          <div style={{ position:"absolute", bottom:10, right:10, zIndex:4, display:"flex", alignItems:"center", gap:8, background:"rgba(0,0,0,0.75)", borderRadius:8, padding:"6px 10px" }}>
            <button onClick={function() { setMuted(!muted); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#fff", fontSize:14 }}>
              {muted ? "🔇" : "🔊"}
            </button>
            <input type="range" min="0" max="100" value={muted ? 0 : volume} onChange={function(e) { setVolume(Number(e.target.value)); setMuted(false); }} style={{ width:70, accentColor:ACCENT }} />
            <button onClick={function() { if (videoRef.current && videoRef.current.requestFullscreen) videoRef.current.requestFullscreen(); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#fff", fontSize:14 }}>
              ⛶
            </button>
          </div>
        </div>

        {/* Channel switcher */}
        <div style={{ marginTop:14 }}>
          <div style={{ fontSize:10, fontWeight:700, color:MUTED, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>Cambiar canal</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {CHANNELS.map(function(ch) {
              var isActive = activeChannel && activeChannel.id === ch.id;
              return (
                <button key={ch.id} onClick={function() { handleSelectChannel(ch); setWatchingMatch(null); }} style={{ background: isActive ? ACCENT : CARD, color: isActive ? "#fff" : MUTED_LIGHT, border:"1px solid " + (isActive ? ACCENT : BORDER), borderRadius:8, padding:"8px 14px", cursor:"pointer", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:5, boxShadow: isActive ? "0 0 12px " + ACCENT_GLOW : "none" }}>
                  {ch.country} {ch.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── FIXTURE VIEW ─────────────────────────────────────────────
  function FixtureView() {
    return (
      <div style={{ padding:"16px 20px", maxWidth:860, margin:"0 auto" }}>

        {/* Day pills */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
          {DAYS.map(function(d) {
            return (
              <button key={d} onClick={function() { setDayFilter(d); }} style={{ background: dayFilter === d ? ACCENT : CARD, color: dayFilter === d ? "#fff" : MUTED, border:"1px solid " + (dayFilter === d ? ACCENT : BORDER), borderRadius:6, padding:"5px 13px", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                {d === "11 Jun" ? "📅 Hoy" : d}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize:10, fontWeight:700, color:MUTED, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>
          {filteredFixture.length} partidos · toca uno para ver en vivo
        </div>

        {filteredFixture.map(function(m) {
          var ch = CHANNELS.find(function(c) { return c.id === m.channelId; });
          return (
            <div key={m.id} style={{ background:CARD, border:"1px solid " + BORDER, borderRadius:10, padding:"14px 16px", marginBottom:8, display:"flex", alignItems:"center", gap:12, cursor:"pointer", transition:"all 0.2s" }}
              onClick={function() { handleWatchMatch(m); }}
              onMouseEnter={function(e) { e.currentTarget.style.border = "1px solid " + ACCENT; e.currentTarget.style.boxShadow = "0 0 14px " + ACCENT_GLOW; }}
              onMouseLeave={function(e) { e.currentTarget.style.border = "1px solid " + BORDER; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* Time */}
              <div style={{ textAlign:"center", minWidth:48, flexShrink:0 }}>
                <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{m.time}</div>
                <div style={{ fontSize:9, color:MUTED }}>MEX</div>
              </div>

              {/* Teams */}
              <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, flex:1, justifyContent:"flex-end" }}>
                  <span style={{ fontSize:13, fontWeight:600, color:TEXT, textAlign:"right" }}>{m.homeName}</span>
                  <span style={{ fontSize:24 }}>{m.homeFlag}</span>
                </div>
                <div style={{ fontSize:11, color:MUTED, background:BG, padding:"3px 10px", borderRadius:6, border:"1px solid " + BORDER, minWidth:36, textAlign:"center", fontWeight:700 }}>vs</div>
                <div style={{ display:"flex", alignItems:"center", gap:6, flex:1 }}>
                  <span style={{ fontSize:24 }}>{m.awayFlag}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:TEXT }}>{m.awayName}</span>
                </div>
              </div>

              {/* Info + Watch button */}
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:9, fontWeight:700, color:ACCENT, letterSpacing:1, marginBottom:2 }}>GRUPO {m.group}</div>
                <div style={{ fontSize:9, color:MUTED, marginBottom:6 }}>{m.city}</div>
                <div style={{ background:ACCENT, color:"#fff", borderRadius:6, padding:"4px 10px", fontSize:10, fontWeight:800, letterSpacing:0.5, display:"inline-flex", alignItems:"center", gap:4, boxShadow:"0 0 10px " + ACCENT_GLOW }}>
                  ▶ Ver
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ marginTop:12, padding:"10px 14px", background:CARD, border:"1px solid " + BORDER, borderRadius:8, fontSize:11, color:MUTED, textAlign:"center" }}>
          🏆 Copa Mundial FIFA 2026 · 11 Jun – 19 Jul · Mexico, EE.UU. y Canada · 48 selecciones
        </div>
      </div>
    );
  }

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"Inter, sans-serif", background:BG, minHeight:"100vh", color:TEXT, display:"flex", flexDirection:"column" }}>

      {/* HEADER */}
      <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px", borderBottom:"1px solid " + BORDER, background:"#0A0102", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, background:"linear-gradient(135deg," + ACCENT + ",#FF3344)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:900, color:"#fff", boxShadow:"0 0 16px " + ACCENT_GLOW }}>G</div>
          <div>
            <div style={{ fontSize:20, fontWeight:900, letterSpacing:3, color:"#fff", lineHeight:1 }}>GoTV</div>
            <div style={{ fontSize:9, color:MUTED, letterSpacing:2 }}>MUNDIAL 2026</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={function() { setTab("fixture"); }} style={{ background: tab === "fixture" ? ACCENT_SOFT : "none", border:"1px solid " + (tab === "fixture" ? ACCENT : BORDER), color: tab === "fixture" ? ACCENT : MUTED, borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            🏟️ Fixture
          </button>
          <button onClick={function() { setTab("player"); }} style={{ background: tab === "player" ? ACCENT_SOFT : "none", border:"1px solid " + (tab === "player" ? ACCENT : BORDER), color: tab === "player" ? ACCENT : MUTED, borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            📺 {activeChannel ? activeChannel.name : "Canales"}
          </button>
        </div>
      </header>

      {/* PAGE */}
      <div style={{ flex:1, overflow:"auto" }}>
        {tab === "fixture" ? FixtureView() : PlayerView()}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0102; }
        ::-webkit-scrollbar-thumb { background: #2A0608; border-radius: 2px; }
      `}</style>
    </div>
  );
}
