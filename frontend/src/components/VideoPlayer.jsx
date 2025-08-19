import React, { useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import Hls from "hls.js";
import { Rnd } from "react-rnd";
import { updateOverlay } from "../api";

const VideoPlayer = ({ streamUrl, overlays, setOverlays }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let hls;
    if (streamUrl && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamUrl;
    }
    return () => { if (hls) hls.destroy(); };
  }, [streamUrl]);

  const handleUpdate = useCallback(async (id, updates) => {
    setOverlays(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    try { await updateOverlay(id, updates); } catch (err) { console.error(err); }
  }, [setOverlays]);

  return (
    <div style={{ position: "relative", width: "80%", margin: "0 auto" }}>
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{ width: "100%", height: "480px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.3)", backgroundColor: "#000" }}
      />
      {overlays.map(o => (
        <Rnd
          key={o.id}
          size={{ width: o.type === "text" ? "auto" : o.size, height: o.type === "text" ? "auto" : o.size }}
          position={{ x: o.position.x, y: o.position.y }}
          bounds="parent"
          style={{ position: "absolute", zIndex: 10, pointerEvents: "auto" }}
          onDragStop={(e, d) => handleUpdate(o.id, { position: { x: d.x, y: d.y } })}
          onResizeStop={(e, dir, ref, delta, pos) => {
            const newSize = o.type === "text" ? Math.max(12, Math.round((ref.offsetWidth / (o.content?.length || 1)) * 1.5)) : parseInt(ref.style.width, 10) || o.size;
            handleUpdate(o.id, { position: pos, size: newSize });
          }}
          dragGrid={[5, 5]}
          resizeGrid={[5, 5]}
        >
          {o.type === "text" ? (
            <div style={{
              fontSize: `${o.size}px`,
              color: o.color || "#fff",
              background: o.background || "rgba(0,0,0,0.7)",
              padding: "4px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              fontFamily: "Arial, sans-serif"
            }}>
              {o.content || "New Text"}
            </div>
          ) : (
            o.url && <img src={`http://localhost:5000${o.url}`} alt="overlay" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          )}
        </Rnd>
      ))}
    </div>
  );
};

VideoPlayer.propTypes = {
  streamUrl: PropTypes.string.isRequired,
  overlays: PropTypes.array.isRequired,
  setOverlays: PropTypes.func.isRequired
};

export default VideoPlayer;
