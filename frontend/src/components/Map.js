import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import RoomIcon from "@mui/icons-material/Room";
import CustomModal from "./MarkerModal/CustomModal"; // Import the MarkerModal component
import "./Map.scss";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
const geojson_url = process.env.REACT_APP_GEOJSON_ENDPOINT;
const geotiff_url = process.env.REACT_APP_GEOTIFF_ENDPOINT;

function Map() {
    const mapContainer = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [isAddingMarker, setIsAddingMarker] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [markerTitle, setMarkerTitle] = useState("");
    const [markerDescription, setMarkerDescription] = useState("");
    const [activeMarkerIndex, setActiveMarkerIndex] = useState(null);
    const [lastAddedMarkerIndex, setLastAddedMarkerIndex] = useState(null);
  useEffect(() => {
    const initializeMap = async () => {
      const initialCoordinates = [-73.409649070133156, 45.981408204560189];
      const initialZoom = 10;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: initialCoordinates,
        zoom: initialZoom,
      });

      map.on("load", async () => {
        try {
          const response = await axios.get(geojson_url);
          const geojsonData = response.data;

          const geojsonDataWithMarkers = {
            type: "FeatureCollection",
            features: [
              ...geojsonData.features,
              ...markers.map((marker, index) => ({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [
                    marker.getLngLat().lng,
                    marker.getLngLat().lat,
                  ],
                },
                properties: {
                  id: index,
                  title: "New Marker",
                  description: "",
                },
              })),
            ],
          };
          map.addSource("raster-source", {
            type: "raster",
            tiles: [geotiff_url],
            tileSize: 256,
          });

          map.addLayer({
            id: "raster-layer",
            type: "raster",
            source: "raster-source",
          });
          map.addSource("points", {
            type: "geojson",
            data: geojsonDataWithMarkers,
          });

          map.addLayer({
            id: "points-layer",
            type: "circle",
            source: "points",
            paint: {
              "circle-radius": 10,
              "circle-stroke-width": 2,
              "circle-color": "red",
              "circle-stroke-color": "white",
            },
          });

          map.addControl(new mapboxgl.NavigationControl());

          setMapInstance(map);
        } catch (error) {
          console.error("Error fetching GeoJSON:", error);
        }
      });
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (mapInstance && isAddingMarker) {
      const handleMapClick = (e) => {
        if (isAddingMarker) {
          const newMarker = new mapboxgl.Marker({
            draggable: true,
          })
            .setLngLat(e.lngLat)
            .addTo(mapInstance);

          setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
          setMarkerTitle(""); // Clear marker title
          setMarkerDescription(""); // Clear marker description
          setActiveMarkerIndex(markers.length); // Set active marker index
        }
      };

      mapInstance.on("click", handleMapClick);

      return () => {
        mapInstance.off("click", handleMapClick);
      };
    }
  }, [mapInstance, isAddingMarker, markers]);

  useEffect(() => {
    if (mapInstance && markers.length > 0) {
      const lastMarker = markers[markers.length - 1];

      const handleMarkerDragEnd = () => {
        // ... (rest of the code remains the same)
      };

      lastMarker.on("dragend", handleMarkerDragEnd);

      return () => {
        lastMarker.off("dragend", handleMarkerDragEnd);
      };
    }
  }, [mapInstance, markers]);

  const handleMarkerAddButtonClick = () => {
    setIsAddingMarker(!isAddingMarker);
    setMarkerTitle("");
    setMarkerDescription("");
    setActiveMarkerIndex(markers.length);
  };

  const handleMarkerModalSubmit = (markerInfo, index) => {
    if (index !== null) {
      const updatedMarkers = [...markers];
      const markerToUpdate = updatedMarkers[index];
      markerToUpdate
        .setPopup(new mapboxgl.Popup().setHTML(`<p><strong>Title:</strong> ${markerInfo.title}</p><p><strong>Description:</strong> ${markerInfo.description}</p>`));
      setMarkers(updatedMarkers);
      setActiveMarkerIndex(null);
      setLastAddedMarkerIndex(index); // Set the last added marker index
    }
  };

  const handleMarkerModalClose = () => {
    setMarkerTitle("");
    setMarkerDescription("");
    setActiveMarkerIndex(null);
    if (lastAddedMarkerIndex !== null) {
      const updatedMarkers = [...markers];
      updatedMarkers.splice(lastAddedMarkerIndex, 1);
      setMarkers(updatedMarkers);
      setLastAddedMarkerIndex(null);
    }
  };

  return (
    <div className="root">
      <div className="app">
        <div
          className={`marker-button${isAddingMarker ? " active" : ""}`}
          onClick={handleMarkerAddButtonClick}
        >
          <RoomIcon />
        </div>

        <div className="map-container" ref={mapContainer} />

        {markers.map((marker, index) => (
        <CustomModal
          key={index}
          markerToAdd={marker.getLngLat()}
          onMarkerAdd={(markerInfo) => handleMarkerModalSubmit(markerInfo, index)}
          onCancel={() => handleMarkerModalClose(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Map;