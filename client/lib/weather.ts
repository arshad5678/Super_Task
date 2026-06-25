export interface WeatherResponse {
  temp: number;
  humidity: number;
  condition: string;
  description: string;
  icon: string;
  city: string;
}

export async function fetchWeather(city: string): Promise<WeatherResponse> {
  const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch weather data");
  }
  return response.json();
}

export function getWeatherEmoji(condition: string): string {
  switch (condition?.toLowerCase()) {
    case "clear":
      return "☀️";
    case "clouds":
      return "☁️";
    case "rain":
    case "drizzle":
      return "🌧️";
    case "snow":
      return "❄️";
    case "thunderstorm":
      return "⛈️";
    case "mist":
    case "haze":
    case "fog":
    case "smoke":
      return "🌫️";
    default:
      return "⛅";
  }
}
