import React, { useState } from 'react';
import axios from 'axios';
import './ColorPaletteGenerator.css';
import { FiRefreshCcw } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai'; // Loading spinner
import { AiOutlineCopy } from 'react-icons/ai';

const ColorPaletteGenerator = () => {
  const [image, setImage] = useState(null);
  const [palette, setPalette] = useState([]);
  const [loading, setLoading] = useState(false); // NEW: Loading state

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      alert('⚠️ Please select a PNG or JPG image file only.');
      e.target.value = '';
      setImage(null);
      return;
    }

    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) return alert('Please select an image first.');
    setLoading(true); // START loading

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post(
        'https://coooooodingggprojects.onrender.com/get-colors',
        formData
      );
      setPalette(res.data.palette);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false); // END loading
    }
  };

  const handleReset = () => {
    setPalette([]);
    setImage(null);
    document.getElementById('cpg-file-input').value = '';
  };

  const [copiedColor, setCopiedColor] = useState(null);

  return (
    <div className="cpg-container">
      <h2 className="cpg-title">Smart Color Palette Generator</h2>

      <div className="wrapperUploadSubmit">
        <div className="cpg-upload-wrapper">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            id="cpg-file-input"
            className="cpg-file-input"
          />
          <label htmlFor="cpg-file-input" className="cpg-upload-button">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </label>
          <p>{image ? image.name : 'Please upload an image'}</p>
        </div>

        <div className="cpg-buttons">
          <button
            onClick={handleUpload}
            className="cpg-generate-button"
            disabled={loading} // Disable while loading
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="cpg-loading-icon" />
            ) : (
              'Generate'
            )}
          </button>

          {palette.length > 0 && (
            <button onClick={handleReset} className="cpg-reset-button">
              <FiRefreshCcw size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="cpg-palette-wrapper">
        {palette.map((color, i) => (
          <div
            key={i}
            className="cpg-color-swatch"
            style={{
              backgroundColor: color,
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => {
              navigator.clipboard.writeText(color);
              setCopiedColor(color);
              setTimeout(() => setCopiedColor(null), 1500); // hide after 1.5s
            }}
          >
            <span className="cpg-color-code">{color}</span>
            <AiOutlineCopy className="cpg-copy-icon" />

            {/* Copied overlay */}
            {copiedColor === color && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  fontSize: '12px',
                  pointerEvents: 'none',
                }}
              >
                Copied!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteGenerator;
