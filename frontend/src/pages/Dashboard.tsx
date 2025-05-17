import { useEffect, useState, type FC } from "react"

interface WeatherForecast {
    date: string;
    temperatureC: number;
    summary: string;
}

const Dashboard: FC = () => {
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


export default Dashboard
