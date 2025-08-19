from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# ----- MongoDB Connection -----
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["livestream_app"]
overlay_collection = db["overlays"]

# ----- Upload Folder -----
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ----- Helper to convert ObjectId -----
def serialize_overlay(doc):
    return {
        "id": str(doc["_id"]),
        "type": doc.get("type", "text"),        # "text" or "image"
        "content": doc.get("content", ""),      # text content
        "url": doc.get("url", ""),              # image URL for logos
        "size": doc.get("size", 20),
        "position": doc.get("position", {"x": 50, "y": 50})
    }

# ----- Routes -----

# GET all overlays
@app.route("/api/overlays", methods=["GET"])
def get_overlays():
    overlays = overlay_collection.find()
    return jsonify([serialize_overlay(o) for o in overlays])

# POST create overlay
@app.route("/api/overlays", methods=["POST"])
def create_overlay():
    data = request.json
    if not data or ("type" not in data and "content" not in data and "url" not in data):
        return jsonify({"error": "Overlay data required"}), 400

    overlay = {
        "type": data.get("type", "text"),       # default text
        "content": data.get("content", ""),
        "url": data.get("url", ""),             # for image overlays
        "size": data.get("size", 20),
        "position": data.get("position", {"x": 50, "y": 50})
    }
    result = overlay_collection.insert_one(overlay)
    overlay["_id"] = result.inserted_id
    return jsonify(serialize_overlay(overlay)), 201

# PUT update overlay
@app.route("/api/overlays/<id>", methods=["PUT"])
def update_overlay(id):
    data = request.json
    overlay_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "type": data.get("type"),
            "content": data.get("content"),
            "url": data.get("url"),
            "size": data.get("size"),
            "position": data.get("position")
        }}
    )
    overlay = overlay_collection.find_one({"_id": ObjectId(id)})
    return jsonify(serialize_overlay(overlay))

# DELETE overlay
@app.route("/api/overlays/<id>", methods=["DELETE"])
def delete_overlay(id):
    overlay_collection.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Overlay deleted"})

# ----- Upload Logo from Local PC -----
@app.route("/api/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    file_url = f"/uploads/{file.filename}"  # relative URL for frontend
    return jsonify({"url": file_url})

# Serve uploaded files
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ----- Run Server -----
if __name__ == "__main__":
    app.run(debug=True)
