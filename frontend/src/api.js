import axios from "axios";

const BASE_URL = "http://localhost:5000/api/overlays";

export const getOverlays = () => axios.get(BASE_URL);
export const createOverlay = (overlay) => axios.post(BASE_URL, overlay);
export const updateOverlay = (id, overlay) => axios.put(`${BASE_URL}/${id}`, overlay);
export const deleteOverlay = (id) => axios.delete(`${BASE_URL}/${id}`);

