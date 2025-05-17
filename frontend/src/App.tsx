import { useEffect, useState } from "react"
import "./App.css"
import mascotTransparent from "./assets/mascot/mascot-transparent.png"

interface WeatherForecast {
  date: string;
  temperatureC: number;
  summary: string;
}

function App() {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/WeatherForecast")
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: WeatherForecast[]) => {
        setForecasts(data);
      })
      .catch(err => {
        console.error("Failed to load forecasts", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <div className="p-4 space-y-2">
      <div className="flex gap-3 items-center">
        <img src={mascotTransparent} alt="mascotTransparent" className="h-30" />
        <h1 className="text-2xl font-bold">Penny Pilot</h1>
      </div>
      <ul>
        {forecasts.map((f, i) => (
          <li key={i} className="border-b py-2">
            <strong>{f.date}</strong>: {f.summary} ({f.temperatureC}°C)
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App
