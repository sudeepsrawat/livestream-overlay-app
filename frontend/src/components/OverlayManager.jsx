import React, { useState } from "react";
import { createOverlay, deleteOverlay as apiDelete, updateOverlay } from "../api";

const OverlayManager = ({ overlays, setOverlays }) => {
  const [newOverlay, setNewOverlay] = useState({
    type: "text",
    content: "",
    color: "#ffffff",
    background: "rgba(0,0,0,0.5)",
    size: 24,
    position: { x: 50, y: 50 },
    url: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [editOverlay, setEditOverlay] = useState({});

  // Add new overlay
  const addOverlay = async () => {
    if ((newOverlay.type === "text" && !newOverlay.content) ||
        (newOverlay.type === "image" && !newOverlay.url)) return;

    try {
      const res = await createOverlay(newOverlay);
      setOverlays(prev => [...prev, res.data]);
      setNewOverlay({ type: "text", content: "", color: "#fff", background: "rgba(0,0,0,0.5)", size: 24, position: { x: 50, y: 50 }, url: "" });
    } catch (err) { console.error(err); }
  };

  // Upload image for overlay
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:5000/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      setNewOverlay({ ...newOverlay, type: "image", url: data.url });
    } catch (err) { console.error(err); }
  };

  // Delete overlay
  const deleteOverlay = async (id) => {
    try {
      await apiDelete(id);
      setOverlays(prev => prev.filter(o => o.id !== id));
    } catch (err) { console.error(err); }
  };

  // Start editing overlay
  const startEditing = (overlay) => {
    setEditingId(overlay.id);
    setEditOverlay({ ...overlay });
  };

  // Save edited overlay
  const saveEdit = async () => {
    try {
      await updateOverlay(editingId, editOverlay);
      setOverlays(prev => prev.map(o => o.id === editingId ? { ...o, ...editOverlay } : o));
      setEditingId(null);
      setEditOverlay({});
    } catch (err) { console.error(err); }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditOverlay({});
  };

  return (
    <div style={{ padding: 15, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>Overlay Manager</h3>

      {/* Add new overlay */}
      <select value={newOverlay.type} onChange={e => setNewOverlay({ ...newOverlay, type: e.target.value })}>
        <option value="text">Text</option>
        <option value="image">Image/Logo</option>
      </select>

      {newOverlay.type === "text" && (
        <>
          <input type="text" placeholder="Overlay text" value={newOverlay.content} onChange={e => setNewOverlay({ ...newOverlay, content: e.target.value })} />
          <input type="color" value={newOverlay.color} onChange={e => setNewOverlay({ ...newOverlay, color: e.target.value })} />
          <input type="color" value={newOverlay.background} onChange={e => setNewOverlay({ ...newOverlay, background: e.target.value })} />
          <input type="number" value={newOverlay.size} onChange={e => setNewOverlay({ ...newOverlay, size: parseInt(e.target.value) || 24 })} />
        </>
      )}

      {newOverlay.type === "image" && (
        <>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          {newOverlay.url && <img src={`http://localhost:5000${newOverlay.url}`} alt="preview" style={{ width: 80 }} />}
        </>
      )}

      <button onClick={addOverlay} style={{ marginTop: 5 }}>➕ Add Overlay</button>

      {/* Current overlays */}
      <h4>Current Overlays</h4>
      <ul>
        {overlays.map(o => (
          <li key={o.id} style={{ marginBottom: 8 }}>
            {editingId === o.id ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {o.type === "text" && (
                  <>
                    <input type="text" value={editOverlay.content} onChange={e => setEditOverlay({ ...editOverlay, content: e.target.value })} />
                    <input type="color" value={editOverlay.color} onChange={e => setEditOverlay({ ...editOverlay, color: e.target.value })} />
                    <input type="color" value={editOverlay.background} onChange={e => setEditOverlay({ ...editOverlay, background: e.target.value })} />
                    <input type="number" value={editOverlay.size} onChange={e => setEditOverlay({ ...editOverlay, size: parseInt(e.target.value) || 24 })} />
                  </>
                )}
                <button onClick={saveEdit}>💾 Save</button>
                <button onClick={cancelEdit}>❌ Cancel</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span>{o.type === "text" ? o.content : "Image"} ({o.size}px @ {o.position.x},{o.position.y})</span>
                <button onClick={() => startEditing(o)}>✏️ Edit</button>
                <button onClick={() => deleteOverlay(o.id)}>🗑 Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OverlayManager;
