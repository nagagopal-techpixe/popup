import React, { useState, useEffect } from "react";
import "./popuprouter.css";
import { useParams } from "react-router-dom";

export default function PopupModal() {
  const { mediaId } = useParams();
  const [matchedMedia, setMatchedMedia] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(true);

  // Fetch media from backend
  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch(`https://bteam11.com/api/auth/media/${mediaId}`);
        const data = await res.json();

        console.log("Backend response:", data);

        if (data.found) {
          setMatchedMedia([data.media]); // Always array
        } else {
          setMatchedMedia([]);
        }
      } catch (err) {
        console.error("Error:", err);
        setMatchedMedia([]);
      }
    }

    fetchMedia();
  }, [mediaId]);

  // Handle subscribe
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const selectedMediaId = matchedMedia[0]?.mediaId; // safe access

    try {
      const response = await fetch("https://bteam11.com/api/auth/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          mediaId: selectedMediaId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        setMessage(data.message || "Subscription failed!");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        {/* Close Button */}
        <button className="close-btn" onClick={() => setShowPopup(false)}>✕</button>

        {/* Left Side */}
        <div className="popup-left">
          <div className="popup-left-text">
            <h1 className="popup-title">Want Exclusive Updates?</h1>
            <p className="popup-text">
              Drop your email and get access to our latest posts, insights,
              and creative drops — straight to your inbox.
            </p>
          </div>

          <form className="popup-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Email*"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" className="SubmitPOP" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>

          {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>

        {/* Right Side: Media Preview */}
        <div className="popup-right" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {matchedMedia.map((media) => (
            <div key={media.mediaId} style={{ flex: "1 1 200px" }}>

              {/* Image */}
              {media.image && (
                <img
                  src={media.image}
                  alt="media"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              )}

              {/* Video */}
              {media.video && (
                <video
                  src={media.video}
                  autoPlay
                  controls
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

