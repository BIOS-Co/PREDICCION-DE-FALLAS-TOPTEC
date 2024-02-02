
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
  const get_processes = async () => {
    const path = environment.api + environment.get_process;
    let config = {
      headers: {
      },
    };
    return await axios.get(path, config);
  };

  const get_all_info = async () => {
    const path = environment.api + environment.get_all;
    let config = {
      headers: {
      },
    };
    return await axios.get(path, config);
  };

  const post_data = async (data) => {
    const path = environment.api + environment.post_processes;

    let config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const order = [
        data.PP_Hidro_Cemento_Kg,
        data.PP_Hidro_Carbonato_Kg,
        data.PP_Hidro_Silice_Kg,
        data.PP_Hidro_Celulosa_Kg,
        data.PP_Hidro_Hidroxido_Kg,
        //aca creo que va PP_Hidro_Bentonita_Kg
        data.PP_Hidro_SolReales_porcentage,
        data.PP_Hidro_CelulosaS_porcentage,
        // data.PP_Hidro_CelulosaSR_SR_grados
        data.PP_Refi_EE_AMP,
        data.PP_Refi_CelulosaH_porcentage,
        data.PP_Refi_CelulosaS_porcentage,
        data.PP_Refi_CelulosaSR_SR_grados,
        data.PP_Maq_FlujoFloc_L_min,
        data.PP_Maq_Resi_ml,
        data.PP_Maq_Vueltas_N,
        data.PP_Maq_Vel_m_min,
        data.PP_Maq_FormatoP_PSI,
        data.PP_Maq_FlujoFlocForm_L_Placa,
        data.PP_Maq_VacíoCP_PulgadasHg,
        data.PP_Maq_VacioSF_PulgadasHg,
        data.PP_Maq_Recir__porcentage,
        data.PP_Maq_Fieltro_Dias,
        data.PP_PF_Humedad__porcentage,
        data.PP_PF_Espesor_mm,
        data.PP_PF_Dens_g_cm3,
        data.PP_Maq_FlocCanalS__porcentage,
        data.PP_Maq_FlocTkS__porcentage,
        data.PP_Maq_FlocFormS__porcentage,
        data.PP_MaqTCE_Densidad_g_cm3,
        data.PP_Maq_TCES__porcentage,
        data.PP_Maq_CilinS__porcentage,
        data.PP_Maq_Cono1S__porcentage,
        data.PP_Maq_MolinoS__porcentage,
        data.PP_Maq_P1H__porcentage,
        data.PP_Maq_P3H__porcentage
    ];

    let body = {
        machine : data.machine,
        process : data.process,
        data: order,
    };
    console.log(body, 'body')
    return await axios.post(path, body, config);
};

const post_excel_ = async (file) => {
  const path = environment.api + environment.post_excel;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(path, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Puedes manejar la respuesta del backend aquí
    console.log('Respuesta del backend:', response.data);
    return response.data;
  } catch (error) {
    // Puedes manejar errores aquí
    console.error('Error al enviar el archivo:', error);
    throw error;
  }
};

  export {get_machine,get_processes ,post_excel_ ,get_all_info,post_data};