import { StateAnnotation } from '../state';
import { AbstractGraphNode } from '../../models/GraphNode';

export class LoadWeatherNode extends AbstractGraphNode {
  static definition = {
    id: 'loadWeather',
    name: 'Load Weather',
    description: 'Load weather data for a given location.',
    type: 'weather',
    output: 'json',
    tags: [
      'async',
      'static'
    ]
  }

  static skills = [];

  static async run(state: typeof StateAnnotation.State) {
    // This should load the weather as a message, then send it back to the supervisor
    const { locationList } = state;
    const weatherData = await this.fetchWeatherData(locationList);
    return {
      lastToolCalled: 'load_weather',
      ...state,
      weatherData,
    };
  };

  static async fetchWeatherData(locationList: string[]): Promise<any> {
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
}

