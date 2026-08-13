export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'New York';
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey && apiKey !== '2cb83cfbb873e2298dc72ee998585ae6_placeholder') {
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
      if (res.ok) {
        const data = await res.json();
        return Response.json({
          city: data.name,
          temp: Math.round(data.main.temp),
          condition: data.weather[0]?.main || 'Clear',
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6), // km/h
          icon: data.weather[0]?.icon
        });
      }
    } catch (e) {
      console.warn('Weather API fetch failed, serving fallback:', e);
    }
  }

  // Realistic fallback weather data
  return Response.json({
    city: city,
    temp: 24,
    condition: 'Partly Cloudy',
    humidity: 58,
    wind: 12,
    source: 'AURON Weather Simulator'
  });
}
