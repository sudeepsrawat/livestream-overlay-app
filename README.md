# Livestream Overlay Manager

A React + Flask web app for streaming live video with dynamic overlays. Add, edit, resize, and position text or image overlays in real time. Overlay data is stored in MongoDB, and image uploads are supported.

---

## Features

- Play HLS/RTSP video streams in the browser  
- Add, edit, and delete text or image overlays  
- Drag, resize, and reposition overlays dynamically  
- Persist overlays in MongoDB  
- Upload image logos for overlays  

---

## Tech Stack

- **Frontend:** React, react-rnd, HLS.js  
- **Backend:** Flask, Flask-CORS, PyMongo  
- **Database:** MongoDB  

---

## User Documentation

### Setup & Installation

1. **Clone the repo:**

```bash
git clone <repo-url>
cd <repo-folder>
```
2. **Backend Setup:**
   
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on http://localhost:5000/

2. **Frontend Setup:**
   
```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000/

## Using the App

1. **Enter Stream URL**  
   Enter your HLS or RTSP stream URL in the input box on the landing page.

2. **Manage Overlays** using the Overlay Manager panel:

   - **Add Overlay:**  
     Choose text or image, enter content or upload an image, customize color, background, size, and click **➕ Add**.
   
   - **Edit Overlay:**  
     Click on an overlay in the list to modify content, color, size, or background.
   
   - **Delete Overlay:**  
     Click **🗑 Delete** next to an overlay.

3. **Real-time Updates:**  
   Overlays appear in real time on the video player and can be dragged/resized directly on the video.

4. **Image Uploads:**  
   Uploaded images are saved to the backend and served via `/uploads/<filename>`.

## API Documentation

All endpoints are served from `http://localhost:5000/api/overlays`.

| Method | Endpoint               | Description               | Request Body Example                                                                                               |
|--------|-----------------------|---------------------------|--------------------------------------------------------------------------------------------------------------------|
| GET    | `/api/overlays`        | Fetch all overlays        | —                                                                                                                  |
| POST   | `/api/overlays`        | Create a new overlay      | `{ "type": "text", "content": "Hello", "size": 24, "position": {"x":50,"y":50}, "color":"#fff", "background":"rgba(0,0,0,0.5)", "url":"" }` |
| PUT    | `/api/overlays/<id>`   | Update an existing overlay| `{ "content":"Updated text", "size":30 }`                                                                          |
| DELETE | `/api/overlays/<id>`   | Delete an overlay         | —                                                                                                                  |
| POST   | `/api/upload`          | Upload an image file      | FormData with key `file`                                                                                           |

## Screenshots
<img width="1771" height="899" alt="SS1" src="https://github.com/user-attachments/assets/9a6b1f35-09ec-41fb-91f4-64725b6581c9" />
<img width="1810" height="902" alt="SS2" src="https://github.com/user-attachments/assets/6dbe5c09-53c8-40de-8a2e-bdef354d5fdf" />

---

