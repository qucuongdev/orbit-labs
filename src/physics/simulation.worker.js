import { simulateRocketFlight } from './rk4Solver.js';

self.onmessage = ({ data }) => {
  try {
    self.postMessage({ result: simulateRocketFlight(data.config, data.aeroData) });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
