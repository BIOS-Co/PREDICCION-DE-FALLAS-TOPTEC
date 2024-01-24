import React, { useState } from 'react'
import Select, { components } from 'react-select'
import makeAnimated from 'react-select/animated';
import Pagination from 'pagination-for-reactjs-component'
import DatePicker from "react-multi-date-picker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport, faClockRotateLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

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
  { value: 1, label: "5" },
  { value: 2, label: "15" },
  { value: 3, label: "25" },
  { value: 4, label: "50" },
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

  const [pageIndex, setPageIndex] = React.useState(1);
  let pageCount = 10;

  const minDate = new Date(2021, 0, 1);
  const maxDate = new Date(2100, 11, 31);

  const changeRadioModelHistory = (type) => {
    setModelHistory(type);
  };

  const [typeModelHistory, setModelHistory] = useState("machine_learning_model");

  return (
    <React.Fragment>
      <div className='row gx-4 d-flex flex-wrap flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-between justify-content-sm-between justify-content-md-between justify-content-lg-between justify-content-xl-between justify-content-xxl-between align-items-center align-self-center align-self-xxl-center ms-1 me-1'>
        <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto flex-grow-1'>
          <div className='col-12 d-flex flex-row justify-content-start align-items-center align-self-center'>
            <FontAwesomeIcon className='me-3' icon={faClockRotateLeft} size="xl"/>
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
            <label className="btn rounded-pill btn-transparent- btn-radio- bs-1- ps-4 pe-4 pt-3 pb-3" htmlFor="table-type-machine-learning-model"> Modelo de machine learning
            </label>
          </div>
        </div>
        <div className='col-auto'>
          <div className="w-auto">
            <input type="radio" className="btn-check" name="options-table-models" id="table-type-computer-vision-model" checked={typeModelHistory === "computer_vision_model"} onChange={() => changeRadioModelHistory("computer_vision_model")
              } />
            <label className="btn rounded-pill btn-radio- bs-1- ps-4 pe-4 pt-3 pb-3"
              htmlFor="table-type-computer-vision-model">
              Modelo de computer vision
            </label>
          </div>
        </div>
      </div>
      {typeModelHistory === "machine_learning_model" && (
        <>
          <div className='row gx-4 d-flex flex-wrap flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-between justify-content-sm-between justify-content-md-between justify-content-lg-between justify-content-xl-between justify-content-xxl-between align-items-center align-self-center align-self-xxl-center mt-5 mb-5 ms-4 me-4'>
            <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto flex-grow-1'>
              <div className='col-12 d-flex flex-row justify-content-start align-items-center align-self-center'>
                <h3 className="m-0 p-0 lh-sm fs-2- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">Machine Learning</h3>
              </div>
            </div>
            <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto flex-grow-1 gap-1 d-flex flex-row justify-content-end justify-content-sm-end justify-content-md-end justify-content-lg-end justify-content-xl-end justify-content-xxl-end align-items-center align-self-center mt-3 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0 mt-xxl-0'>
              <div className='row gx-2 d-flex flex-row justify-content-center align-items-center align-self-center'>
                <div id='internal-form' className="col-auto">
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
          </div>
          <div className='row mt-4 mb-4 ms-4 me-4'>
            <div className='col-12'>
              <form action="" className='position-relative wrapper-search- d-block d-sm-block d-md-block d-lg-block d-xl-block d-xxl-block'>
                <div className='form-search inner-addon- left-addon-'>
                  <input type="text" className='form-control search-' id="buscador-modulos" placeholder="Buscar" />
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
              </form>
            </div>
          </div>
          <div className='row mt-4 ms-4 me-4'>
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
          <div className='row mb-2 ms-4 me-4'>
            <div className='col-12'>
              <div className='table-responsive table-general-'>
                <table className='table table-sm table-striped table-bordered border-light table-rounded- align-middle'>
                  <thead>
                    <tr>
                      <th scope="col" className='th-width-xs-'>
                        <div className='d-flex flex-row justify-content-start align-items-center align-self-center w-100'>
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
                      <th scope="col" className='th-width-auto-'>
                        <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                          <span className='fs-6-'>Nombre</span>
                        </div>
                      </th>
                      <th scope="col" className='th-width-auto-'>
                        <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                          <span className='fs-6-'>Fecha</span>
                        </div>
                      </th>
                      <th scope="col" className='th-width-auto-'>
                        <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                          <span className='fs-6-'>Fallan</span>
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
                        <p className='m-0 lh-sm fs-5- text-center'>Lote 1</p>
                      </td>
                      <td className='align-middle'>
                        <p className='m-0 lh-sm fs-5- text-center'>23/01/24</p>
                      </td>
                      <td className='align-middle'>
                        <p className='m-0 lh-sm fs-5- text-center'>20</p>
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
                        <p className='m-0 lh-sm fs-5- text-center'>Lote 2</p>
                      </td>
                      <td className='align-middle'>
                        <p className='m-0 lh-sm fs-5- text-center'>23/01/24</p>
                      </td>
                      <td className='align-middle'>
                        <p className='m-0 lh-sm fs-5- text-center'>20</p>
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
                        <p className='m-0 lh-sm fs-5- text-center'>Lote 3</p>
                      </td>
                      <td className='align-middle'>
                        <p className='m-0 lh-sm fs-5- text-center'>23/01/24</p>
                      </td>
                      <td className='align-middle'>
                        <p className='m-0 lh-sm fs-5- text-center'>20</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='row mt-2 mb-4 ms-4 me-4'>
            <div className='col-12 d-flex flex-row justify-content-center align-items-center align-self-center'>
              <Pagination
                pageCount={pageCount}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
              />
            </div>
          </div>
          <div className='row gx-2 d-flex flex-row justify-content-end align-items-start align-self-start mt-4 mb-4 ms-4 me-4'>
            <div className='col-12 col-sm-12 col-md-auto col-lg-auto col-xl-auto col-xxl-auto'>
              <button type='button' className="btn-neumorphic- btn-primary-blue- d-flex flex-row justify-content-center align-items-center align-self-center"><FontAwesomeIcon className='me-2' icon={faFileExport} size="sm"/>
                <span className='lh-1 le-spacing-05- fs-5- font-noto-regular- fw-bold'>Exportar</span>
              </button>
            </div>
          </div>
        </>
      )}

      {typeModelHistory === "computer_vision_model" && (
        <>
        <div className='row gx-4 d-flex flex-wrap flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-between justify-content-sm-between justify-content-md-between justify-content-lg-between justify-content-xl-between justify-content-xxl-between align-items-center align-self-center align-self-xxl-center mt-5 mb-5 ms-4 me-4'>
          <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto flex-grow-1'>
            <div className='col-12 d-flex flex-row justify-content-start align-items-center align-self-center'>
              <h3 className="m-0 p-0 lh-sm fs-2- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">Computer vision</h3>
            </div>
          </div>
          <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto flex-grow-1 gap-1 d-flex flex-row justify-content-end justify-content-sm-end justify-content-md-end justify-content-lg-end justify-content-xl-end justify-content-xxl-end align-items-center align-self-center mt-3 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0 mt-xxl-0'>
            <div className='row gx-2 d-flex flex-row justify-content-center align-items-center align-self-center'>
              <div id='internal-form' className="col-auto">
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
        </div>
        <div className='row mt-4 mb-4 ms-4 me-4'>
          <div className='col-12'>
            <form action="" className='position-relative wrapper-search- d-block d-sm-block d-md-block d-lg-block d-xl-block d-xxl-block'>
              <div className='form-search inner-addon- left-addon-'>
                <input type="text" className='form-control search-' id="buscador-modulos" placeholder="Buscar" />
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
            </form>
          </div>
        </div>
        <div className='row mt-4 ms-4 me-4'>
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
        <div className='row mb-2 ms-4 me-4'>
          <div className='col-12'>
            <div className='table-responsive table-general-'>
              <table className='table table-sm table-striped table-bordered border-light table-rounded- align-middle'>
                <thead>
                  <tr>
                    <th scope="col" rowSpan="2" className='th-width-xs- sticky-column-start- no-relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-start align-items-center align-self-center w-100'>
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
                    <th scope="col" rowSpan="2" className='th-width-auto- sticky-column-start- no-relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Fecha y hora de inferencia</span>
                      </div>
                    </th>
                    <th scope="col" rowSpan="2" className='th-width-auto- sticky-column-start- no-relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Placas buenas</span>
                      </div>
                    </th>
                    <th scope="col" colSpan="11" className='th-width-auto- sticky-column-start- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Características de defectos</span>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" className='th-width-auto- sticky-column-start- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Basura</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-auto- sticky-column-start- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Delaminación</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-auto- sticky-column-start- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Desborde</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-auto- sticky-column-start- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Despunte</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-auto- sticky-column-start- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Fisura</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-auto- sticky-column-start- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Mancha</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-auto- sticky-column-start- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Maquina</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-auto- sticky-column-start- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Nudo</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-auto- sticky-column-start- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Separador</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-auto- sticky-column-start- relevance- align-middle'>
                      <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                        <span className='fs-6-'>Tallón</span>
                      </div>
                    </th>
                    <th scope="col" className='th-width-auto- sticky-column-start- relevance- align-middle'>
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
        <div className='row mt-2 mb-4 ms-4 me-4'>
          <div className='col-12 d-flex flex-row justify-content-center align-items-center align-self-center'>
            <Pagination
              pageCount={pageCount}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
            />
          </div>
        </div>
        <div className='row gx-2 d-flex flex-row justify-content-end align-items-start align-self-start mt-4 mb-4 ms-4 me-4'>
          <div className='col-12 col-sm-12 col-md-auto col-lg-auto col-xl-auto col-xxl-auto'>
            <button type='button' className="btn-neumorphic- btn-primary-blue- d-flex flex-row justify-content-center align-items-center align-self-center"><FontAwesomeIcon className='me-2' icon={faFileExport} size="sm"/>
              <span className='lh-1 le-spacing-05- fs-5- font-noto-regular- fw-bold'>Exportar</span>
            </button>
          </div>
        </div>
        </>
      )}
    </React.Fragment>
  )
}
