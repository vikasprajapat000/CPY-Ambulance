// frontend/src/services/locationService.js

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information unavailable'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out'));
            break;
          default:
            reject(new Error('Failed to get location'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

export const geocodeLocation = async (lat, lng) => {
  // DEMO / FALLBACK geocoding
  // (No API key needed – safe for college project)

  try {
    return {
      address: `Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}, India`
    };
  } catch (error) {
    throw new Error('Failed to get address from coordinates');
  }
};
