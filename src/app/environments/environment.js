import { configuraciones } from "../../webConfig";

let server = configuraciones.server;
 

export const environment = {
    api: server,


    get_machines : 'predict/machines/',
    get_process : 'predict/processes/',
    post_processes: 'predict/process-data/',
    get_all: 'predict/load-feature/',


    // historico 1
    get_history1 : 'predict/dat-predictions/',
    get_excel1 : 'predict/generate-excel/',

}