import React, { useState } from "react";
import { Modal, TextField, Button } from "@mui/material";
import "./CustomModal.scss";

function CustomModal({ markerToAdd, onMarkerAdd }) {
  const [markerTitle, setMarkerTitle] = useState("");
  const [markerDescription, setMarkerDescription] = useState("");
  const [showMarkerModal, setShowMarkerModal] = useState(true); // Show the modal by default

  const handleMarkerModalSubmit = () => {
    onMarkerAdd({
      title: markerTitle,
      description: markerDescription,
      lngLat: markerToAdd,
    });
    setMarkerTitle("");
    setMarkerDescription("");
    setShowMarkerModal(false); // Close the modal after submitting
  };

  const handleMarkerModalClose = () => {
    setMarkerTitle("");
    setMarkerDescription("");
    setShowMarkerModal(false);
  };

  return (
    <div className="marker-modal-container">
      <Modal
        open={showMarkerModal}
        onClose={handleMarkerModalClose}
        classes={{
          root: "custom-modal-root",
          paper: "custom-modal-paper",
        }}
      >
        <div className="marker-modal-content">
          <TextField
            label="Title"
            variant="outlined"
            value={markerTitle}
            onChange={(e) => setMarkerTitle(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            value={markerDescription}
            onChange={(e) => setMarkerDescription(e.target.value)}
          />
          <div className="modal-button-group">
            <Button variant="contained" onClick={handleMarkerModalSubmit}>
              Submit
            </Button>
            <Button variant="contained" onClick={handleMarkerModalClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


export default CustomModal;
