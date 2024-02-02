import React, { useState } from 'react'
import Select, { components } from 'react-select'
import makeAnimated from 'react-select/animated';
import Pagination from 'pagination-for-reactjs-component'
import DatePicker from "react-multi-date-picker";
import Preloader from '../../shared/preloader/Preloader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { get_history_1, generate_excel_1 } from '../../../services/daHistory/load_data';

/**
 * MENSAJES PERSONALIZADOS AL BUSCAR O CARGAR OPCIONES EN REACT SELECT
 */

const { NoOptionsMessage } = components;

const customNoOptionsMessage = props => (
  <NoOptionsMessage {...props} className="custom-no-options-message-internal-form-">No registrado</NoOptionsMessage>
);

const { LoadingMessage } = components;

const customLoadingMessage = props => (
  <LoadingMessage {...props} className="custom-loading-message-internal-form-">Cargando</LoadingMessage>
);

/**
 * ANIMATE DELETE MULTISELECT
 */

const animatedComponents = makeAnimated();

/**
 * Se genera componente nuevo para soportar el placeholder animado del input 
 */

const { ValueContainer, Placeholder } = components;

const CustomValueContainer = ({ children, ...props }) => {
  const { inputId, placeholder } = props.selectProps;
  return (
    <ValueContainer {...props}>
      <Placeholder htmlFor={inputId} {...props}>
        {placeholder}
      </Placeholder>
      {React.Children.map(children, child =>
        child && child.type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

/**
 * Constante que soporta todo el cambio de los estilo del select para el número de registros en las tablas
 */

const selectRegistersStyles = {
  /**
  * Estilos del icono del dropdown del select
  * Estilos del separador del select
  * Estilos del icono de cerrar del select
  */
  indicatorsContainer: (styles) => ({ ...styles, 
    marginTop: '-10px !important', 
  }),
  dropdownIndicator: (styles) => ({ ...styles, 
    color: "#212529", 
    padding: 0, paddingTop: '0.34rem !important', 
    paddingRight: '0.5rem !important',
    width: '25px',
    height: '25px',
    "&:hover": {
      color: "#212529",
    } 
  }),
  indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
  clearIndicator: (styles) => ({ ...styles, 
    color: "#212529", 
    padding: 0, 
    paddingTop: '0.05rem !important',
    width: '15px',
    height: '15px',
    "&:hover": {
      color: "#212529",
    } 
  }),
  /**
   * ESTILOS DEL INPUT GLOBAL
   */
  control: () => ({
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    alignSelf: "start",
    justifyContent: "start",
    minWidth: 140,
    maxWidth: 150,
    height: 48,
    paddingLeft: '0.8rem',
    paddingTop: '0.3rem',
    paddingBottom: '0.2rem',
    width: "100%",
    backgroundColor: 'var(--back-color)',
    borderRadius: '50rem',
    boxShadow: 'inset 2px 2px 5px #BABECC, inset -5px -5px 10px #FFF',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease-in-out',
    appearance: 'none',
    "-webkit-appearance": {
      appearance: 'none',
    },
    borderBottom: "0px solid transparent",
  }),
  /**
  * ESTILOS DEL INPUT
  */
  input: (provided) => ({
  ...provided,
  color: '#728998',
  fontSize: 13,
  textTransform: "uppercase",
  fontFamily: 'var(--font-family-regular-noto-)',
  gridArea: '1/1/2/2',
    overflow: 'hidden',
    textAlign: 'start',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }),
  /**
  * ESTILOS DEL MENU DESPLEGABLE DEL SELECT
  */
  menu: (styles) => ({
  ...styles,
  border: 'none',
  backgroundColor: 'rgba(255, 255, 255, 1)',
  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 6px 0px',
  borderRadius: '1rem',
  padding: 0,
  marginTop: 8,
  marginBottom: 0,
  height: 'auto',
  minHeight: 'auto',
  maxHeight: 300,
  overflow: "hidden",
  color: '#728998',
  fontSize: 12,
  textTransform: "uppercase",
  fontFamily: 'var(--font-family-regular-noto-)',
  zIndex: 2,
  }),
  menuList: () => ({
    paddingTop: 0,
    paddingBottom: 0,
    height: 'auto',
    minHeight: 'auto',
    maxHeight: 300,
    overflow: "auto",
    "::-webkit-scrollbar": {
      width: "0px !important",
      height: "0px !important",
    },
    "::-webkit-scrollbar-track": {
      background: "transparent !important"
    },
    "::-webkit-scrollbar-thumb": {
      background: "transparent !important"
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "transparent !important"
    }
  }),
  /**
  * ESTILOS DE LAS OPCIONES DESPLEGABLES
  */
  option: (provided, state) => ({
  ...provided,
  fontSize: 11,
  textTransform: "uppercase",
  backgroundColor: state.isSelected ? "var(--color-secondary-blue-)" : "rgba(255, 255, 255, 1)",
  fontFamily: 'var(--font-family-regular-noto-)',
  padding: '0.5rem 0.8rem 0.5rem 0.8rem',
  borderRadius: '1rem',
  ":hover": {
  background: "var(--color-secondary-blue-)",
  color: '#FFFFFF',
  }
  }),
  /**
  * ESTILOS DEL CONTENEDOR
  */
  container: (provided, state) => ({
  ...provided,
  marginTop: 0,
  width: '100%',
  position: 'relative',
  flex: '1 1 auto'
  }),
  valueContainer: (provided, state) => ({
  ...provided,
  overflow: "visible",
  position: "relative",
  top: "4px"
  }),
  /**
  * ESTILOS PLACEHOLDER DEL INPUT
  */
  placeholder: (provided, state) => ({
  ...provided,
  width: '100%',
  position: "absolute",
  top: state.hasValue || state.selectProps.inputValue ? -10 : "0%",
  left: state.hasValue || state.selectProps.inputValue ? -0 : "0%",
  transition: "top 0.1s, font-size 0.1s",
  color: state.hasValue || state.selectProps.inputValue ? 'var(--color-quaternary-gray-)' : 'var(--color-primary-blue-)',
  fontSize: state.hasValue || state.selectProps.inputValue ? 11 : "12px",
  lineHeight: 1.25,
  fontFamily: 'var(--font-family-regular-noto-)',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  overflow: 'hidden',
  textAlign: 'start',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
  }),
  /**
  * ESTILOS TEXTO EN EL INPUT
  */
  singleValue: (styles) => ({ 
  ...styles, 
  fontSize: 12,
  textTransform: "uppercase",
  color: "var(--color-quaternary-gray-)", 
  fontFamily: 'var(--font-family-regular-noto-)', 
  padding: '3px',
  margin: '0px',
  marginTop: '2px',
  marginLeft: 0,
  marginRight: 0,
  gridArea: '1/1/2/2',
    overflow: 'hidden',
    textAlign: 'start',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }),
  multiValue: (styles) => ({ 
    ...styles, 
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 6px 0px',
    borderRadius: '0.5rem',
    alignItems: 'center',
    alignSelf: 'center',
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    fontFamily: 'var(--font-family-regular-noto-)',
    fontSize: 14,
    color: '#728998',
    paddingLeft: '0.5rem',
    paddingRight: '0.6rem',
    paddingBottom: '0.3rem'
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    borderRadius: '6rem',
    paddingLeft: '6px',
    width: '26px',
    height: '26px',
    color: '#212529',
    backgroundColor: '#F8F8F8',
    ':hover': {
      color: '#FFFFFF',
      backgroundColor: '#2A70FF',
    }
  })
}

/**
 * Data que llena los select
 */

const SelectRegisters = [
  { value: 5, label: "5" },
  { value: 15, label: "15" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
];

/**
  * MESES Y DIAS EN ESPAÑOL PARA EL DATEPICKER
  */

const espanol_es_lowercase = {
  name: "espanol_es_lowercase",
  months: [
    ["Ene", "Ene"],
    ["Feb", "Feb"],
    ["Mar", "Mar"],
    ["Abr", "Abr"],
    ["May", "May"],
    ["Jun", "Jun"],
    ["Jul", "Jul"],
    ["Ago", "Ago"],
    ["Sep", "Sep"],
    ["Oct", "Oct"],
    ["Nov", "Nov"],
    ["Dic", "Dic"],
  ],
  weekDays: [
    ["Domingo", "Do"],
    ["Lunes", "Lu"],
    ["Martes", "Ma"],
    ["Miércoles", "Mi"],
    ["Jueves", "Ju"],
    ["Viernes", "Vi"],
    ["Sábado", "Sa"]
  ],
  digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  meridiems: [
    ["AM", "am"],
    ["PM", "pm"],
  ],
};

const weekDays = [
  ["Domingo", "Do"],
  ["Lunes", "Lu"],
  ["Martes", "Ma"],
  ["Miércoles", "Mi"],
  ["Jueves", "Ju"],
  ["Viernes", "Vi"],
  ["Sábado", "Sa"]
]

export default function DataHistory() {

  const [charging, setCharging] = React.useState(false);

  const [pageIndex, setPageIndex] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(10);
  const [show, setShow] = useState(5);
  const [filter, setFilter] = useState('');

  const minDate = new Date(2021, 0, 1);
  const maxDate = new Date(2100, 11, 31);

  // variable para seleccionar todo

  const [select_all, setSelect_all] = useState(false);

  const changeRadioModelHistory = (type) => {
    setModelHistory(type);
  };

  const [typeModelHistory, setModelHistory] = useState("machine_learning_model");
  const [subList, setSubList] = useState([]);

  //definicion de variables
  const [historyData, setHistoryData] = React.useState([]);

 

  const getHistory = async () => {
    let response = await get_history_1().catch((e) => {
      console.log(e);
    });
    if (response && response.data && response.data.dat_predictions) {
      // Asumiendo que response.data.dat_predictions es un arreglo
      const dataWithCheckbox = response.data.dat_predictions.map(item => ({
        ...item, // Toma todas las propiedades existentes del objeto
        isSelected: false // Añade la propiedad isSelected inicializada en false
      }));
      setHistoryData(dataWithCheckbox);
    } else {
      // Maneja el caso de que no haya datos o el formato sea inesperado
      console.log('No data received or data is in unexpected format');
    }
    setCharging(false)
  };

  React.useEffect(() => {
    getHistory()
    setCharging(true)
  }, [])


// filtro del buscador

const changeFilter = ({ target }) => {
  setFilter(target.value);
  let filteredData = historyData; // Usa todo historyData si no hay filtro

  if (target.value !== '') {
    filteredData = historyData.filter(item => {
      // Simplifica la lógica de filtrado si es posible
      return Object.keys(item).some(key =>
        key !== 'id' && key !== 'checked' && key !== 'history' && String(item[key]).toUpperCase().includes(target.value.toUpperCase())
      );
    });
  }

  // Aplica la paginación al conjunto de datos filtrados
  const paginatedData = filteredData.slice(0, show);
  setSubList(paginatedData);
  setPageCount(Math.ceil(filteredData.length / show));
};



/// paginacion
 
const obtainSubList = () => {
  let index1 = (pageIndex - 1) * show;
  let index2 = pageIndex * show;
  let array = historyData.slice(index1, index2);
  setSubList(array);

};

React.useEffect(() => {

    obtainSubList();

  setPageCount(Math.ceil((historyData.length + 1) / show));
}, [pageIndex, show, historyData]);

React.useEffect(() => {
  // Asegúrate de trabajar con los datos filtrados para la paginación
  let currentData = filter ? historyData.filter(item => {
    return Object.keys(item).some(key =>
      key !== 'id' && key !== 'checked' && key !== 'history' && String(item[key]).toUpperCase().includes(filter.toUpperCase())
    );
  }) : historyData;

  const paginatedData = currentData.slice((pageIndex - 1) * show, pageIndex * show);
  setSubList(paginatedData);

  // Ajusta pageCount basado en los datos filtrados
  setPageCount(Math.ceil(currentData.length / show));
}, [pageIndex, show, filter, historyData]); // Incluye `filter` en las dependencias


// manejar los checkbox

const handleCheckboxChange = (id) => {
  const newData = historyData.map(item => {
    if (item.id === id) {
      return { ...item, isSelected: !item.isSelected };
    }
    return item;
  });
  setHistoryData(newData);
};

// funcion para exportar los excel
const exportSelected = async () => {
  setCharging(true); // Supongo que esto es para mostrar algún indicador de carga


  const selectedData = historyData.filter(item => item.isSelected).map(item => ({
    // Prepara los datos con los campos requeridos
    mala: item.mala,
    lote: item.Lote ? item.Lote : item.id, // Usa Lote si existe, de lo contrario, usa id
    registration: item.registration
  }));

  try {
    // Utiliza generate_excel_1 para enviar los datos al backend
    const response = await generate_excel_1(selectedData);

    // Procesa la respuesta y descarga el archivo
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;

    const contentDisposition = response.headers['content-disposition'];
    let filename = 'DatPrediction.xlsx'; // Nombre por defecto
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename="?(.+)"?/);
      if (matches.length === 2) filename = matches[1];
    }
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cambia isSelected a false para todos los elementos después de la exportación
    const updatedHistoryData = historyData.map(item => ({
      ...item,
      isSelected: false // Desmarca todos los elementos
    }));
    setSelect_all(false);
    setHistoryData(updatedHistoryData);
  } catch (error) {
    console.error('Error al exportar los datos seleccionados:', error);
  } finally {
    setSelect_all(false);
    // Asegúrate de detener el indicador de carga independientemente del resultado
    setCharging(false);
  }
};

// seleccionar todo 

const toggleSelectAll = () => {
  const newSelectAllValue = !select_all;
  setSelect_all(newSelectAllValue);
  const updatedHistoryData = historyData.map(item => ({
    ...item,
    isSelected: newSelectAllValue,
  }));
  setHistoryData(updatedHistoryData);
};






console.log("historyData", historyData)
console.log("pageCount", pageCount)
console.log("subList", subList)
console.log("select_all", select_all)



  return (
    <React.Fragment>
 {
        charging 
        ?
        (
          <Preloader />
        )
        :
        (
          null
        )
      }
      <div className='row gx-4 d-flex flex-wrap flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-between justify-content-sm-between justify-content-md-between justify-content-lg-between justify-content-xl-between justify-content-xxl-between align-items-center align-self-center align-self-xxl-center ms-1 me-1'>
        <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto flex-grow-1'>
          <div className='col-12 d-flex flex-row justify-content-start align-items-center align-self-center'>
            <FontAwesomeIcon className='fs-2- me-2' icon={faClockRotateLeft}/>
            <h3 className="m-0 p-0 lh-sm fs-2- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">Histórico</h3>
          </div>
        </div>
        <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto flex-grow-1 gap-1 d-flex flex-row justify-content-end justify-content-sm-end justify-content-md-end justify-content-lg-end justify-content-xl-end justify-content-xxl-end align-items-center align-self-center mt-3 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0 mt-xxl-0'>
        </div>
      </div>
      <div className='row g-3 gy-sm-3 gy-md-0 gy-lg-0 gy-xl-0 gy-xxl-0 d-flex flex-row justify-content-center align-items-start align-self-start mt-4 mb-4'>
        <div className='col-auto'>
          <div className="w-auto">
            <input type="radio" className="btn-check" name="options-table-models"
              id="table-type-machine-learning-model" checked={typeModelHistory === "machine_learning_model"} onChange={() => changeRadioModelHistory("machine_learning_model")} />
            <label className="btn rounded-pill d-flex flex-row justify-content-center align-items-center align-self-center btn-transparent- btn-radio- bs-1- ps-4 pe-4 pt-3 pb-3" htmlFor="table-type-machine-learning-model"> 
              <i className='fa icon-machine-learning me-2'></i><span>Modelo de Aprendizaje automático</span> 
            </label>
          </div>
        </div>
        <div className='col-auto'>
          <div className="w-auto">
            <input type="radio" className="btn-check" name="options-table-models" id="table-type-computer-vision-model" checked={typeModelHistory === "computer_vision_model"} onChange={() => changeRadioModelHistory("computer_vision_model")
              } />
            <label className="btn rounded-pill d-flex flex-row justify-content-center align-items-center align-self-center btn-radio- bs-1- ps-4 pe-4 pt-3 pb-3"
              htmlFor="table-type-computer-vision-model">
                <i className='fa icon-computer-vision me-2'></i><span>Modelo de Visión por computador</span>
            </label>
          </div>
        </div>
      </div>
      {typeModelHistory === "machine_learning_model" && (
        <>
          <div className='row gx-4 d-flex flex-wrap flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-between justify-content-sm-between justify-content-md-between justify-content-lg-between justify-content-xl-between justify-content-xxl-between align-items-center align-self-center align-self-xxl-center mt-5 mb-4 mb-sm-4 mb-md-5 mb-lg-5 mb-xl-5 mb-xxl-5 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
            <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto flex-grow-1'>
              <div className='col-12 d-flex flex-row justify-content-start align-items-center align-self-center'>
                <h3 className="m-0 p-0 lh-sm fs-2- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">Aprendizaje automático</h3>
              </div>
            </div>
            <div className='col-12 col-sm-12 col-md-auto col-lg-auto col-xl-auto col-xxl-auto d-flex flex-row justify-content-end justify-content-sm-end justify-content-md-end justify-content-lg-end justify-content-xl-end justify-content-xxl-end align-items-center align-self-center mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0 mt-xxl-0'>
              <div id='internal-form' className="col-12 col-sm-12 col-md-auto col-lg-auto col-xl-auto col-xxl-auto">
                <div className='form-floating inner-addon- left-addon-'>
                  <div className='form-control'>
                    <DatePicker
                      range
                      numberOfMonths={2}
                      inputClass="custom-style-date-picker-"
                      placeholder='dd-mm-yy ~ dd-mm-yy'
                      weekDays={weekDays}
                      locale={espanol_es_lowercase}
                      format="YYYY-MM-DD"
                      minDate={minDate}
                      maxDate={maxDate}
                      calendarPosition="bottom-left"
                      showOtherDays={true}
                      fixMainPosition={true}
                      shadow={true}
                      animation={true}
                      arrowStyle={{ 
                        display: "none"
                      }}
                    />
                  </div>
                  <label className='fs-5- ff-monse-regular-'>Rango de fecha</label>
                </div>
              </div>
            </div>
          </div>
          <div className='row mt-4 mb-4 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
            <div className='col-12'>
              <form action="" className='position-relative wrapper-search- d-block d-sm-block d-md-block d-lg-block d-xl-block d-xxl-block'>
                <div className='form-search inner-addon- left-addon-'>
                  <input type="text" className='form-control search-' id="buscador-modulos" placeholder="Buscar" value={filter} onChange={changeFilter}/>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
              </form>
            </div>
          </div>
          <div className='row mt-4 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
            <div className='col-12 d-flex flex-row justify-content-end align-items-center align-self-center'>
              <form id='internal-form' action='' className='position-relative'>
                <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                  <div className='col-auto d-flex flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-center align-items-center align-self-center me-auto'>
                    <div className='form-floating inner-addon- left-addon-'>
                      <Select id='select-registers' options={SelectRegisters} onChange={(option)=> setShow(option.value)} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="# registros" styles={selectRegistersStyles} isClearable={true} name='maq'/>
                        <i className='fa icon-id-type fs-xs'></i>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className='row mb-2 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
            <div className='col-12'>
              <div className='table-responsive table-general-'>
                <table className='table table-sm table-striped table-bordered border-light table-rounded- align-middle mb-1'>
                  <thead>
                    <tr>
                      <th scope="col" className='th-width-xs-'>
                        <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                          <div className='w-auto d-flex flex-row justify-content-center align-items-center align-self-center'>
                            <div className='checks-radios-'>
                            <label>
                              <input type="checkbox" name="selectAll" checked={select_all} onChange={toggleSelectAll}/>
                              <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'></span>
                            </label>
                            </div>
                          </div>
                        </div>
                      </th>
                      <th scope="col" className='th-width-md-'>
                        <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                          <span className='fs-6-'>Nombre</span>
                        </div>
                      </th>
                      <th scope="col" className='th-width-sm-'>
                        <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                          <span className='fs-6-'>Fecha</span>
                        </div>
                      </th>
                      <th scope="col" className='th-width-sm-'>
                        <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                          <span className='fs-6-'>Malas</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {subList?.map((data, index) => (
                    <tr>
                      <td className='align-middle'>
                        <div className='w-auto d-flex flex-row justify-content-center align-items-center align-self-center'>
                          <div className='checks-radios-'>
                            <label>
                            <input
                              type="checkbox"
                              checked={data.isSelected}
                              onChange={() => handleCheckboxChange(data.id)}
                            />
                              <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'></span>
                            </label>
                          </div>
                        </div>
                      </td>
                      <td className='align-middle'>
                      <p className='m-0 lh-sm fs-5- text-center'>
                        {data.Lote ? data.Lote : data.id}
                      </p>
                    </td>
                      <td className='align-middle'>
                        <p className='m-0 lh-sm fs-5- text-center'>{data.registration}</p>
                      </td>
                      <td className='align-middle'>
                        <p className='m-0 lh-sm fs-5- text-center'>{data.mala}</p>
                      </td>
       
                    </tr>
                    )) }
                    </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='row mt-4 mb-4 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
            <div className='col-12 d-flex flex-row justify-content-center align-items-center align-self-center'>
              <Pagination
              pageCount={pageCount}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              />
            </div>
          </div>
          <div className='row gx-2 d-flex flex-row justify-content-end align-items-start align-self-start mt-4 mb-4 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
            <div className='col-12 col-sm-12 col-md-auto col-lg-auto col-xl-auto col-xxl-auto'>
              <button type='button' onClick={exportSelected} className="btn-neumorphic- btn-primary-blue- d-flex flex-row justify-content-center align-items-center align-self-center"><i className='fa icon-download-file me-2'></i>
                <span className='lh-1 le-spacing-05- fs-5- font-noto-regular- fw-bold'>Exportar</span>
              </button>
            </div>
          </div>
        </>
      )}

      {typeModelHistory === "computer_vision_model" && (
        <>
        <div className='row gx-4 d-flex flex-wrap flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-between justify-content-sm-between justify-content-md-between justify-content-lg-between justify-content-xl-between justify-content-xxl-between align-items-center align-self-center align-self-xxl-center mt-5 mb-4 mb-sm-4 mb-md-5 mb-lg-5 mb-xl-5 mb-xxl-5 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
          <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto flex-grow-1'>
            <div className='col-12 d-flex flex-row justify-content-start align-items-center align-self-center'>
              <h3 className="m-0 p-0 lh-sm fs-2- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">Visión por computador</h3>
            </div>
          </div>
          <div className='col-12 col-sm-12 col-md-auto col-lg-auto col-xl-auto col-xxl-auto d-flex flex-row justify-content-end justify-content-sm-end justify-content-md-end justify-content-lg-end justify-content-xl-end justify-content-xxl-end align-items-center align-self-center mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0 mt-xxl-0'>
            <div id='internal-form' className="col-12 col-sm-12 col-md-auto col-lg-auto col-xl-auto col-xxl-auto">
              <div className='form-floating inner-addon- left-addon-'>
                <div className='form-control'>
                  <DatePicker
                    range
                    numberOfMonths={2}
                    inputClass="custom-style-date-picker-"
                    placeholder='dd-mm-yy ~ dd-mm-yy'
                    weekDays={weekDays}
                    locale={espanol_es_lowercase}
                    format="YYYY-MM-DD"
                    minDate={minDate}
                    maxDate={maxDate}
                    calendarPosition="bottom-left"
                    showOtherDays={true}
                    fixMainPosition={true}
                    shadow={true}
                    animation={true}
                    arrowStyle={{
                      display: "none"
                    }}
                  />
                </div>
                <label className='fs-5- ff-monse-regular-'>Rango de fecha</label>
              </div>
            </div>
          </div>
        </div>
        <div className='row mt-4 mb-4 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
          <div className='col-12'>
            <form action="" className='position-relative wrapper-search- d-block d-sm-block d-md-block d-lg-block d-xl-block d-xxl-block'>
              <div className='form-search inner-addon- left-addon-'>
                <input type="text" className='form-control search-' id="buscador-modulos" placeholder="Buscar" />
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
            </form>
          </div>
        </div>
        <div className='row mt-4 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
          <div className='col-12 d-flex flex-row justify-content-end align-items-center align-self-center'>
            <form id='internal-form' action='' className='position-relative'>
              <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                <div className='col-auto d-flex flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-center align-items-center align-self-center me-auto'>
                  <div className='form-floating inner-addon- left-addon-'>
                    <Select id='select-registers' options={SelectRegisters} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="# registros" styles={selectRegistersStyles} isClearable={true} name='maq'/>
                      <i className='fa icon-id-type fs-xs'></i>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className='row mb-2 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
          <div className='col-12'>
            <div className='table-responsive table-general-'>
              <table className='table table-sm table-striped table-bordered border-light table-rounded- align-middle mb-1'>
                <thead>
                  <tr>
                    <th scope="col" rowSpan="2" className='th-width-xs- no-relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <div className='w-auto d-flex flex-row justify-content-center align-items-center align-self-center'>
                          <div className='checks-radios-'>
                            <label>
                              <input type="checkbox" name="radio"/>
                              <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th scope="col" rowSpan="2" className='th-width-sm- no-relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Fecha y hora de inferencia</span>
                      </div>
                    </th>
                    <th scope="col" rowSpan="2" className='th-width-sm- no-relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Placas buenas</span>
                      </div>
                    </th>
                    <th scope="col" rowSpan="2" className='th-width-sm- no-relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Placas malas</span>
                      </div>
                    </th>
                    <th scope="col" colSpan="11" className='th-width-auto-  relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Características de defectos</span>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" className='th-width-xxs- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Basura</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-xxs- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Delaminación</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-xxs- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Desborde</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-xxs- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Despunte</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-xxs- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Fisura</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-xxs- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Mancha</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-xxs- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Maquina</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-xxs- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Nudo</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-xxs- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Separador</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-xxs- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Tallón</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-xxs- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Burbuja</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='align-middle'>
                      <div className='w-auto d-flex flex-row justify-content-center align-items-center align-self-center'>
                        <div className='checks-radios-'>
                          <label>
                            <input type="checkbox" name="radio"/>
                            <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'></span>
                          </label>
                        </div>
                      </div>
                    </td>
                    <td className='align-middle'>
                      <p className='m-0 lh-sm fs-5- text-center'>23/01/24 9:28</p>
                    </td>
                    <td className='align-middle'>
                      <p className='m-0 lh-sm fs-5- text-center'>10</p>
                    </td>
                    <td className='align-middle'>
                      <p className='m-0 lh-sm fs-5- text-center'>10</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>5</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>30</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>8</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>9</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>2</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>35</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>41</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>29</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>50</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>36</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>8</p>
                    </td>
                  </tr>
                  <tr>
                    <td className='align-middle'>
                      <div className='w-auto d-flex flex-row justify-content-center align-items-center align-self-center'>
                        <div className='checks-radios-'>
                          <label>
                            <input type="checkbox" name="radio"/>
                            <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'></span>
                          </label>
                        </div>
                      </div>
                    </td>
                    <td className='align-middle'>
                      <p className='m-0 lh-sm fs-5- text-center'>23/01/24 9:28</p>
                    </td>
                    <td className='align-middle'>
                      <p className='m-0 lh-sm fs-5- text-center'>10</p>
                    </td>
                    <td className='align-middle'>
                      <p className='m-0 lh-sm fs-5- text-center'>10</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>5</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>30</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>8</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>9</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>2</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>35</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>41</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>29</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>50</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>36</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>8</p>
                    </td>
                  </tr>
                  <tr>
                    <td className='align-middle'>
                      <div className='w-auto d-flex flex-row justify-content-center align-items-center align-self-center'>
                        <div className='checks-radios-'>
                          <label>
                            <input type="checkbox" name="radio"/>
                            <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'></span>
                          </label>
                        </div>
                      </div>
                    </td>
                    <td className='align-middle'>
                      <p className='m-0 lh-sm fs-5- text-center'>23/01/24 9:28</p>
                    </td>
                    <td className='align-middle'>
                      <p className='m-0 lh-sm fs-5- text-center'>10</p>
                    </td>
                    <td className='align-middle'>
                      <p className='m-0 lh-sm fs-5- text-center'>10</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>5</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>30</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>8</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>9</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>2</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>35</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>41</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>29</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>50</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>36</p>
                    </td>
                    <td className='align-middle relevance-'>
                      <p className='m-0 lh-sm fs-5- text-center'>8</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className='row mt-4 mb-4 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
          <div className='col-12 d-flex flex-row justify-content-center align-items-center align-self-center'>
            <Pagination
              pageCount={pageCount}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
            />
          </div>
        </div>
        <div className='row gx-2 d-flex flex-row justify-content-end align-items-start align-self-start mt-4 mb-4 ms-1 me-1 ms-sm-1 me-sm-1 ms-md-1 me-md-1 ms-lg-1 me-lg-1 ms-xl-1 me-xl-1 ms-xxl-1 me-xxl-1'>
          <div className='col-12 col-sm-12 col-md-auto col-lg-auto col-xl-auto col-xxl-auto'>
            <button type='button' className="btn-neumorphic- btn-primary-blue- d-flex flex-row justify-content-center align-items-center align-self-center"><i className='fa icon-download-file me-2'></i>
              <span className='lh-1 le-spacing-05- fs-5- font-noto-regular- fw-bold'>Exportar</span>
            </button>
          </div>
        </div>
        </>
      )}
    </React.Fragment>
  )
}
