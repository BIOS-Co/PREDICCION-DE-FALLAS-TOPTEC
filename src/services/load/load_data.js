
import { environment } from '../../app/environments/environment';
import axios from "axios"
 

const get_machine = async () => {
    const path = environment.api + environment.get_machines;
    let config = {
      headers: {
      },
    };
    return await axios.get(path, config);
  };


  export {get_machine };