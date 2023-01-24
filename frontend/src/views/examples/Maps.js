import React from "react";
import { Card, Row } from "reactstrap";

const MapWrapper = ({ onChangeLocation }) => {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    let google = window.google;
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
    });
    const input = document.getElementById("pac-input");
    // Specify just the place data fields that you need.
    const autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ["place_id", "geometry", "formatted_address", "name"],
    });

    autocomplete.bindTo("bounds", map);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById("infowindow-content");

    infowindow.setContent(infowindowContent);

    const marker = new google.maps.Marker({ map: map });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
    autocomplete.addListener("place_changed", () => {
      infowindow.close();

      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      // Set the position of the marker using the place ID and location.
      // @ts-ignore This should be in @typings/googlemaps.
      marker.setPlace({
        placeId: place.place_id,
        location: place.geometry.location,
      });
      marker.setVisible(true);
      infowindowContent.children.namedItem("place-name").textContent = place.name;
      // infowindowContent.children.namedItem("place-id").textContent =
      //   place.place_id;
      infowindowContent.children.namedItem("place-address").textContent =
        place.formatted_address;
      infowindow.open(map, marker);
      onChangeLocation({
        name: place.name,
        address: place.formatted_address,
        id: place.place_id
      });
    });
  }, []);


  return (
    <>
      <div style={{ display: 'none' }}>
        <input
          style={{
            backgroundColor: "#fff",
            borderRadius: "2px",
            width: "450px",
            border: "1px solid transparent",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            boxSizing: "border-box",
            fontFamily: "Roboto",
            fontSize: "15px",
            fontWeight: "300",
            height: "29px",
            marginLeft: "17px",
            marginTop: "10px",
            outline: "none",
            padding: "0 11px 0 13px",
            textOverflow: "ellipsis",
          }}
          id="pac-input"
          className="controls"
          type="text"
          placeholder="Enter a location"
        />
      </div>
      <div
        style={{ height: `200px` }}
        className="map-canvas"
        id="map"
        ref={mapRef}
      ></div>
      <div id="infowindow-content">
        <span id="place-name" className="title"></span>
        <span id="place-address"></span>
      </div>
    </>
  );
};

const Maps = ({ onChangeLocation }) => {
  return (
    <>
      <Row>
        <div className="col">
          <Card className="shadow border-0">
            <MapWrapper onChangeLocation={onChangeLocation} />
          </Card>
        </div>
      </Row>
    </>
  );
};

export default Maps;
