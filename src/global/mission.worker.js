import { createMission } from './engine.js';
self.onmessage = ({data}) => {
  try {self.postMessage({id:data.id,mission:createMission(data.input)});}
  catch(error) {self.postMessage({id:data.id,error:error.message});}
};
