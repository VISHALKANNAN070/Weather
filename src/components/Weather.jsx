import React, { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "../styles/weather.css";

const WeatherApp = () => {
  const inputRef = useRef();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (city) => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setErrorMsg("Please enter a city name.");
      setWeather(null);
      setSearched(true);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSearched(true);

    try {
      const apiKey = import.meta.env.VITE_API;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "City not found.");
        setWeather(null);
        return;
      }

      setWeather({
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        humidity: data.main.humidity,
        location: data.name,
      });
    } catch (error) {
      setErrorMsg("Network error or invalid response.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="weather-root">
      <div className="weather-card">
        <div className="weather-search">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter city name"
            aria-label="City Name"
          />
          <button
            onClick={() => search(inputRef.current.value)}
            className="weather-search-btn"
            aria-label="Search Weather"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>

        {loading && <p className="weather-loading">Loading...</p>}
        {errorMsg && <p className="weather-error">{errorMsg}</p>}
        {!searched && !loading && !weather && !errorMsg && (
          <p className="weather-placeholder">
            Weather app, Search to get weather of a place.
          </p>
        )}

        {weather && !loading && !errorMsg && (
          <>
            <div className="weather-header">
              <h1 className="weather-city">{weather.location}</h1>
              <p className="weather-temp">{weather.temperature}°C</p>
            </div>
            <div className="weather-details">
              <div className="weather-detail">
                <span>Humidity</span>
                <span>{weather.humidity}%</span>
              </div>
              <div className="weather-detail">
                <span>Wind Speed</span>
                <span>{weather.windSpeed} km/h</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
