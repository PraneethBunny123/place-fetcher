import { useState, useEffect } from 'react';
import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx'
import {sortPlacesByDistance} from '../loc.js'
import { fetchAvailablePlaces } from './http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isfetching, setIsFetching] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([])
  const [error, setError] = useState()
  
  useEffect(() => {
    setIsFetching(true)
    async function fetchPlaces() {
      try {
        const places = await fetchAvailablePlaces()

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          )
          setAvailablePlaces(sortedPlaces)
          setIsFetching(false)
        })
        
      } catch(error) {
        setError({
          message: error.message || 'could not fetch places, please try again later'
        })
        setIsFetching(false)
      }
    }

    fetchPlaces()
  }, [])

  if(error) {
    return <ErrorPage title="An error occured!"/>
  }

  return (
    <Places
      title="Available Places"
      isLoading={isfetching}
      loadingText="Fetching data"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
