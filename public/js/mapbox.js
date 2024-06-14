/* eslint-disable */

// Parse the locations from the data attribute

export const displayMap = locations => {
  // custom marker
  var customIcon = L.divIcon({
    className: 'custom-icon',
    iconSize: [32, 40] // size of the icon
  });

  // Initialize the map
  var map = L.map('map', { scrollWheelZoom: false }).setView(
    [locations[0].coordinates[1], locations[0].coordinates[0]],
    6
  );

  // Set up the OSM layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // feature group
  const markers = L.featureGroup();

  // Add a marker for each location
  locations.forEach(function(location) {
    const marker = L.marker(
      [location.coordinates[1], location.coordinates[0]],
      {
        icon: customIcon
      }
    ).bindPopup(`Day: ${location.day} /n ${location.description}`);

    markers.addLayer(marker);
  });

  // add feature group to map
  markers.addTo(map);

  map.fitBounds(markers.getBounds(), { padding: [150, 150] });
};
