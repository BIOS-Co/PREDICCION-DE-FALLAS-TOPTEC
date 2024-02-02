
import { environment } from '../../app/environments/environment';
import axios from "axios"
 

const get_history_1 = async () => {
    const path = environment.api + environment.get_history1;
    let config = {
      headers: {
      },
    };
    return await axios.get(path, config);
  };

  

  const generate_excel_1 = async (selectedData) => {
    const path = environment.api + environment.get_excel1;
    let config = {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'blob', // Importante para manejar la descarga de archivos
    };
    return await axios.post(path, selectedData,  config);
  };

  export { get_history_1, generate_excel_1};