import React, { useState, useEffect } from "react";
import VideoPlayer from "./components/VideoPlayer";
import OverlayManager from "./components/OverlayManager";
import axios from "axios";

function App() {
  const [overlays, setOverlays] = useState([]);
  const [url, setUrl] = useState("http://localhost:8080/stream.m3u8");

  useEffect(() => {
    // Fetch overlays from backend
    const fetchOverlays = async () => {
      try {
        const res = await axios.get("/api/overlays");
        setOverlays(res.data);
      } catch (err) {
        console.error("Failed to fetch overlays", err);
      }
    };
    fetchOverlays();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🎥 Livestream App</h1>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter HLS Stream URL"
        style={{ width: "70%", padding: "10px 12px", fontSize: "16px", marginBottom: "20px",
           borderRadius:"6px", border: "1px solid #ccc", outline: "none", display: "block",}}
      />

      <VideoPlayer streamUrl={url} overlays={overlays} setOverlays={setOverlays}/>

      <OverlayManager overlays={overlays} setOverlays={setOverlays}/>
    </div>
  );
}

export default App;
