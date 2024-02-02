import { configuraciones } from "../../webConfig";

let server = configuraciones.server;
 

export const environment = {
    api: server,


    get_machines : 'predict/machines/'

}