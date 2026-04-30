import React, { useRef } from "react";
import "./styles.scss";

const ImageUpload = ({
  label = "",
  previewSrc,
  onFileSelect,
  onRemove,
  accept = "image/*",
}) => {
  const fileInputRef = useRef(null);
  const hasImage = Boolean(previewSrc);

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="st-image-upload">
      <label className="st-label">{label}</label>
      <div
        className={`st-image-upload__container ${hasImage ? 'has-image' : ''}`}
        onClick={handleContainerClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleContainerClick();
          }
        }}
      >
        {hasImage ? (
          <img
            className="st-image-upload__preview"
            src={previewSrc}
            alt="Selected upload"
          />
        ) : (
          <div className="st-image-upload__placeholder">
            <span>Click to upload image</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="st-image-upload__input"
          onChange={handleFileChange}
        />

        {hasImage && (
          <button
            type="button"
            className="st-image-upload__delete"
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
          >
            Remove image
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
