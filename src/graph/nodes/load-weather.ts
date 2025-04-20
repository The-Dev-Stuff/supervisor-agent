import { StateAnnotation } from '../state';

export const loadWeather = {
  description: {
    id: 'loadWeather',
    name: 'Load Weather',
    description: 'Load weather data for a given location.',
    type: 'weather',
    output: 'json',
    tags: [
      'async',
      'static'
    ]
  },
  run: async (state: typeof StateAnnotation.State) => {
    // This should load the weather as a message, then send it back to the supervisor
    console.log("Running loadWeather node with state:", state);
    const { locationList } = state;
    const weatherData = await fetchWeatherData(locationList);
    return {
      ...state,
      weatherData,
    };
  }
}

// Undecided if this will be called from here or from a utils directory
async function fetchWeatherData(locationList: string[]): Promise<any> {
  // Simulate an API call to fetch weather data
  return new Promise((resolve) => {
    setTimeout(() => {
      const weatherData = locationList.map(location => ({
        location,
        temperature: Math.floor(Math.random() * 30) + 1, // Random temperature between 1 and 30
        condition: 'Sunny'
      }));
      resolve(weatherData);
    }, 2000); // Simulate a 2-second delay
  });
}
