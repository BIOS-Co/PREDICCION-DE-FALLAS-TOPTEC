import { configuraciones } from "../../webConfig";

let server = configuraciones.server;
 

export const environment = {
    api: server,


    get_machines : 'predict/machines/',
    get_process : 'predict/processes/',
    post_processes: 'predict/process-data/',
    get_all: 'predict/load-feature/',
    post_excel: 'predict/process-data-excel/',

}