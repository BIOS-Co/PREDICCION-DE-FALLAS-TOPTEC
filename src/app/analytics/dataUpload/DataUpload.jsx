import DropArea from '../../../assets/images/bg_upload_file.png';
import UploadIcon from '../../../assets/images/upload-file.svg';
import React, { useEffect, useRef, useState } from 'react';
import Select, { components } from 'react-select'
import makeAnimated from 'react-select/animated';
import Pagination from 'pagination-for-reactjs-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import * as echarts from 'echarts';
import $, { event } from "jquery"
import { get_all_info, get_machine, get_processes, post_data, post_excel_ } from '../../../services/load/load_data';
import { saveAs } from 'file-saver';
import Preloader from '../../shared/preloader/Preloader';
import Swal from 'sweetalert2';
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
* Constante que soporta todo el cambio de los estilo del select
*/

const selectStyles = {
  /**
  * Estilos del icono del dropdown del select
  * Estilos del separador del select
  * Estilos del icono de cerrar del select
  */
  indicatorsContainer: (styles) => ({
    ...styles,
    marginTop: '-10px !important',
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
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
  clearIndicator: (styles) => ({
    ...styles,
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
    height: 'auto',
    minHeight: 48,
    maxHeight: 150,
    paddingLeft: '0.8rem',
    paddingTop: '0.3rem',
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
  indicatorsContainer: (styles) => ({
    ...styles,
    marginTop: '-10px !important',
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
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
  clearIndicator: (styles) => ({
    ...styles,
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

export default function DataUpload() {

  const [dataGraf, setDataGraf] = useState({})
  const [data, setData] = useState({})
  const [charging, setCharging] = useState(false)
  React.useEffect(() => {

    /**
     * GRAFICA MEDICAL HISTORY 2 (BAR CHART)
     */

    let chartRelevanceCharacteristics = echarts.init(document.getElementById('relevance-characteristics-chart-'));
    let optionRelevanceCharacteristics;

    const dataRelevanceCharacteristics = Object.entries(dataGraf)
    .map(([nameCharacteristics, valueCharacteristics]) => ({
      nameCharacteristics,
      valueCharacteristics: parseFloat(valueCharacteristics.toFixed(4)) // Redondea a 4 decimales
    }))
    .sort((a, b) => b.valueCharacteristics - a.valueCharacteristics)
    .slice(0, 15);
  
  console.log(dataRelevanceCharacteristics);
  console.log(dataGraf, 'data');
  

    const sortedData = dataRelevanceCharacteristics.sort((a, b) => b.valueCharacteristics - a.valueCharacteristics);

    optionRelevanceCharacteristics = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#FAFAFA',
            color: '#212529',
            fontWeight: 'normal',
            fontFamily: 'NotoSans-Regular, Verdana'
          }
        },
        showDelay: 0,
        transitionDuration: 0.2,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
        borderColor: '#FAFAFA',
        padding: 5,
        textStyle: {
          color: '#212529',
          fontSize: 12,
          lineHeight: 10,
          fontWeight: 'normal',
          fontFamily: 'NotoSans-Regular, Verdana'
        },
        extraCssText: 'box-shadow: 0px 1px 8px #142E6E1A'
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        left: 'center',
        top: 10,
        bottom: 20,
        itemGap: 25,
        width: '90%',
        inactiveColor: '#6D7587',
        textStyle: {
          fontSize: '13px',
          color: '#071C35',
          textTransform: 'uppercase', // Coloca el texto en mayúsculas
          fontWeight: 'bold',
          fontFamily: 'NotoSans-Regular, Verdana',
        },
        pageIconSize: 12,
        pageIconColor: '#071C35',
        pageIconInactiveColor: '#212529',
        pageTextStyle: {
          fontSize: '13px',
          fontWeight: 'bold',
          fontFamily: 'NotoSans-Regular, Verdana',
        },
        icon: 'circle',
        formatter: function (params, value) {
          var newParamsName = "";
          var paramsNameNumber = params.length;
          var provideNumber = 50;
          var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
          if (paramsNameNumber > provideNumber) {
            for (var p = 0; p < rowNumber; p++) {
              var tempStr = "";
              if (p === rowNumber - 1) {
                tempStr = (params.length > 6 ? (params.slice(0, 50) + "...") : '');
              } else { }
              newParamsName += tempStr;
            }
          } else {
            newParamsName = params;
          }
          return newParamsName
        },
        data: ['Relevancia de características']
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        showTitle: false,
        right: '12px',
        feature: {
          dataZoom: {
            show: true,
            iconStyle: {
              borderColor: '#212529'
            },
            emphasis: {
              iconStyle: {
                borderColor: '#212529'
              },
            }
          },
          restore: {
            show: true,
            iconStyle: {
              borderColor: '#212529'
            },
            emphasis: {
              iconStyle: {
                borderColor: '#212529'
              },
            }
          },
          saveAsImage: {
            type: 'png',
            name: 'Relevancia de características',
            backgroundColor: '#FAFAFA',
            show: true,
            iconStyle: {
              borderColor: '#212529'
            },
            emphasis: {
              iconStyle: {
                borderColor: '#212529'
              },
            }
          }
        },
        iconStyle: {
          borderColor: '#212529'
        },
        emphasis: {
          iconStyle: {
            borderColor: '#212529'
          },
        },
        bottom: 0,
        pixelRatio: 2,
      },
      grid: [
        {
          containLabel: true,
          borderColor: '#6D7587'
        }
      ],
      xAxis: {
        type: 'category',
        name: '',
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: {
          color: '#6D7587',
          fontWeight: 'normal',
          fontFamily: 'NotoSans-Regular, Verdana'
        },
        axisLabel: {
          color: '#6D7587',
          fontWeight: 'normal',
          fontFamily: 'NotoSans-Regular, Verdana'
        },
        axisLine: {
          lineStyle: {
            color: '#6D7587',
            width: 1,
          }
        },
        boundaryGap: true,
        data: sortedData.map(item => item.nameCharacteristics)
      },
      yAxis: [
        {
          type: 'value',
          name: '',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            color: '#6D7587',
            fontWeight: 'normal',
            fontFamily: 'NotoSans-Regular, Verdana'
          },
          axisLabel: {
            formatter: function (params, value) {
              var newParamsName = "";
              var paramsNameNumber = params.length;
              var provideNumber = 12;
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = "";
                  if (p === rowNumber - 1) {
                    tempStr = (params.length > 6 ? (params.slice(0, 12) + "...") : '');
                  } else { }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName
            },
            color: '#6D7587',
            fontWeight: 'normal',
            fontFamily: 'NotoSans-Regular, Verdana'
          },
          boundaryGap: [0, '0%'],
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#6D7587',
              width: 1,
            }
          },
        },
        {
          type: 'value',
          name: '',
          nameLocation: 'middle',
          nameGap: 25,
          nameTextStyle: {
            color: '#6D7587',
            fontWeight: 'normal',
            fontFamily: 'NotoSans-Regular, Verdana'
          },
          axisLabel: {
            formatter: function (params, value) {
              var newParamsName = "";
              var paramsNameNumber = params.length;
              var provideNumber = 12;
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
              if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = "";
                  if (p === rowNumber - 1) {
                    tempStr = (params.length > 6 ? (params.slice(0, 12) + "...") : '');
                  } else { }
                  newParamsName += tempStr;
                }
              } else {
                newParamsName = params;
              }
              return newParamsName
            },
            color: '#6D7587',
            fontWeight: 'normal',
            fontFamily: 'NotoSans-Regular, Verdana'
          },
          boundaryGap: [0, '0%'],
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#6D7587',
              width: 1,
            }
          },
        },
      ],
      visualMap: {
        top: 'middle',
        right: -5,
        min: 0,
        max: 1,
        text: ['Máximo', 'Mínimo'],
        inRange: {
          color: ['#9AC331', '#FFDE00', '#FF0018']
        },
        textStyle: {
          color: '#212529',
          fontWeight: 'normal',
          fontFamily: 'NotoSans-Regular, Verdana'
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 100,
          handleSize: 8,
          zoomLock: false,
          xAxisIndex: [0, 1],
          backgroundColor: 'rgba(109,117,135, 0.1)',
          dataBackground: {
            lineStyle: {
              color: '#071C35',
              cap: 'round',
              join: 'round',
              miterLimit: 15,
              width: 1,
            },
            areaStyle: {
              color: 'rgba(109,117,135, 0.25)',
              opacity: 1
            }
          },
          selectedDataBackground: {
            lineStyle: {
              color: '#F5F5F5',
              cap: 'round',
              join: 'round',
              width: 1.5,
            },
            areaStyle: {
              color: 'rgba(7,28,53, 1)',
              opacity: 1
            }
          },
          filterColor: 'rgba(109,117,135,0.25)',
          borderColor: '#FAFAFA',
          handleStyle: {
            color: '#626262',
            borderColor: '#626262',
            borderDashOffset: 5,
            borderCap: 'butt',
            borderJoin: 'miter'
          },
          moveHandleSize: 0,
          moveHandleStyle: {
            color: 'transparent',
            borderColor: 'transparent',
            borderJoin: 'round'
          },
          textStyle: {
            color: '#212529',
            fontSize: 12,
            fontWeight: 'normal',
            fontFamily: 'NotoSans-Regular, Verdana'
          },
          emphasis: {
            handleStyle: {
              color: '#626262',
              borderColor: '#626262',
              borderDashOffset: 5,
              borderCap: 'butt',
              borderJoin: 'miter'
            },
            moveHandleStyle: {
              color: 'transparent',
              borderColor: 'transparent',
              borderJoin: 'round'
            }
          },
          widht: '100%',
          height: 40
        },
      ],
      series: [
        {
          type: 'bar',
          name: 'Relevancia de características',
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#212529',
              fontSize: 12,
              fontWeight: 'normal',
              fontFamily: 'NotoSans-Regular, Verdana'
            },
            emphasis: {
              show: true,
              position: 'top',
              color: '#212529',
              fontSize: 12,
              fontWeight: 'normal',
              fontFamily: 'var(--font-family-regular-noto-), Verdana'
            },
          },
          itemStyle: {
            color: "#071C35",
            shadowBlur: 0,
            shadowOffsetY: 0,
          },
          emphasis: {
            focus: 'series'
          },
          data: sortedData.map(item => item.valueCharacteristics),
          animationDelay: function (idx) {
            return idx * 15;
          }
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5;
      }
    };

    optionRelevanceCharacteristics && chartRelevanceCharacteristics.setOption(optionRelevanceCharacteristics);

    $(window).on('resize', function () {
      if (chartRelevanceCharacteristics != null && chartRelevanceCharacteristics !== undefined) {
        chartRelevanceCharacteristics.resize();
      }
    });

    const updateChartHeight = () => {
      if (chartRelevanceCharacteristics != null && chartRelevanceCharacteristics !== undefined) {
        chartRelevanceCharacteristics.resize();
      }
    };

    const handleWindowResize = () => {
      const windowWidth = window.innerWidth;

      // Ajustar opciones del toolbox y visualMap en función del ancho de la ventana
      if (windowWidth < 576 || windowWidth > 1920) {
        optionRelevanceCharacteristics.toolbox.show = false;
        optionRelevanceCharacteristics.visualMap.show = false;
      } else {
        optionRelevanceCharacteristics.toolbox.show = true;
        optionRelevanceCharacteristics.visualMap.show = true;
      }

      chartRelevanceCharacteristics.setOption(optionRelevanceCharacteristics);
    };
   

    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();

    // Evento para actualizar la altura cuando se abre el offcanvas
    $('#relevance-characteristics').on('shown.bs.offcanvas', updateChartHeight);

    // Limpiar el evento cuando el componente se desmonta
    return () => {
      $('#relevance-characteristics').off('shown.bs.offcanvas', updateChartHeight);
    };

  }, [dataGraf])

  const [pageIndex, setPageIndex] = React.useState(1);

  const [showManualCharacterization, setShowManualCharacterization] = useState(false);
  const [showImportCharacterization, setShowImportCharacterization] = useState(false);
  const [showRelevanceCharacteristics, setShowRelevanceCharacteristics] = useState(false);

  // Efecto para aplicar y eliminar la clase al abrir y cerrar el Offcanvas
  React.useEffect(() => {
    const body = document.body;

    if (showManualCharacterization || showImportCharacterization || showRelevanceCharacteristics) {
      body.classList.add('body-overflow-hidden');
    } else {
      body.classList.remove('body-overflow-hidden');
    }

    // Limpiar al desmontar el componente
    return () => {
      body.classList.remove('body-overflow-hidden');
    };
  }, [showManualCharacterization, showImportCharacterization, showRelevanceCharacteristics]);

  const toggleManualCharacterization = () => {
    setShowManualCharacterization(!showManualCharacterization);
  };



  const [selectedFile, setSelectedFile] = useState(null);
  const [data2, setData2] = useState([]);
  const [copyData2, setCopyData2] = useState([]);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);


  };
  const btnCloseRef = useRef();
  const handleSubmit = async () => {
    if (btnCloseRef.current) {
      btnCloseRef.current.click();
      setSelectedFile(null)
      
    }
  };
  
  const toggleImportCharacterization2 = async  () => {
    
      setShowImportCharacterization(!showImportCharacterization);
     
    
  };
  const toggleImportCharacterization = async  () => {
    setCharging(true)
    let response = await post_excel_(selectedFile).catch((e)=>{
      console.log(e)
      Swal.fire({
        icon: "error",
        text: "Se produjo un error al procesar el archivo, recuerde que debe de subir el formato que descarga de esta pagina",
      });
      setCharging(false)
    })
    if (response) {
      console.log(response);
      let resultado = response.resultado;
      let arrayDeSubobjetos = Object.entries(resultado).map(([nombre, subobjeto]) => ({
        nombreOriginal: nombre,
        ...subobjeto
      }));
      setData2(arrayDeSubobjetos)
      setCopyData2(arrayDeSubobjetos)
      console.log(arrayDeSubobjetos);
      setShowImportCharacterization(!showImportCharacterization);
      handleSubmit()
      setCharging(false)

    }
    
  };
  const [seleccionActual, setSeleccionActual] = useState(null);

  const manejarSeleccion = (id) => {
    setSeleccionActual(id);

    const elementosNoNulos = Object.entries(id).filter(([clave, valor]) => valor !== null).reduce((obj, [clave, valor]) => ({ ...obj, [clave]: valor }), {});
setCards2(elementosNoNulos)

        console.log(elementosNoNulos)
        let trueCount = 0;
        let falseCount = 0;
        
        // Iterar sobre los valores del objeto y contar true y false
        for (const key in elementosNoNulos) {
          if (elementosNoNulos.hasOwnProperty(key)) {
            const valor = elementosNoNulos[key];
            
            // Verificar si la clave no es una de las excluidas
            if (key !== "Separador" && key !== "Manipulación" && key !== "Daño_Estiba") {
              if (valor === true) {
                trueCount++;
              } else if (valor === false) {
                falseCount++;
              }
            }
          }
        }
        
        setContadorTrue2(trueCount)
        setContadorFalse2(falseCount)
  };
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const totalItems = data2?.length;
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const slicedLotes = data2?.slice(
    (pageIndex - 1) * itemsPerPage,
    pageIndex * itemsPerPage
  );
  const [viendo, setViendo] = useState('')
  const toggleRelevanceCharacteristics = (identificador) => {
    setViendo(identificador)
    setShowRelevanceCharacteristics(!showRelevanceCharacteristics);
    console.log(data.nt_m2[identificador])
    if (valores.machine === 2 && valores.process === 2) {
      setDataGraf(data.nt_m2[identificador])
    } else if (valores.machine === 1 && valores.process === 2) {
      setDataGraf(data.nt_m1[identificador])
    } else if (valores.machine === 1 && valores.process === 1) {
      setDataGraf(data.aut_m1[identificador])
    } else {
      setDataGraf(data.aut_m1[identificador])
    }
  };
  const toggleRelevanceCharacteristics2 = () => {
    setShowRelevanceCharacteristics(!showRelevanceCharacteristics);
    setViendo('')
    setDataGraf({})

  };
  useEffect(() => {
    getDataIni()
  }, [])

  const [optionsoProcesses, setOptionProcesses] = useState([])
  const descargarXLSX = () => {
    // Ruta del archivo XLSX en la carpeta 'public'
    const rutaArchivo = '/plantilla/Libro1.xlsx';
  
    // Nombre con el que se guardará el archivo descargado
    const nombreArchivo = 'archivo_descargado.xlsx';
  
    // Descargar el archivo utilizando file-saver
    saveAs(rutaArchivo, nombreArchivo);
  };
  
  const cambiarItems = (event)=>{
    setItemsPerPage(parseInt(event.label))
    console.log(parseInt(event.label))
  }
  const [optionsMachine, setOptionMachine] = useState([])
  const getDataIni = async () => {
    setCharging(true)
    let response = await get_machine().catch((e) => {
      console.log(e)
      setCharging(false)
    })
    if (response) {
      console.log(response)
      const transformedOptions = response.data.map((opcion) => ({
        value: opcion.id,
        label: opcion.name
      }));
      setOptionMachine(transformedOptions)
      setCharging(false)
    }

    let response2 = await get_processes().catch((e) => {
      console.log(e)
      setCharging(false)
    })
    if (response2) {
      console.log(response2)
      setCharging(false)
      const transformedOptions2 = response2.data.map((opcion) => ({
        value: opcion.id,
        label: opcion.name
      }));
      setOptionProcesses(transformedOptions2)
    }

    let response4 = await get_all_info().catch((e) => {
      console.log(e)
      setCharging(false)
    })
    if (response4) {
      setCharging(false)
      console.log(response4.data.resultado)

      setData(response4.data.resultado)
    }
  }

  const [valores, setValores] = useState({
    PP_Hidro_Cemento_Kg: '',
    PP_Hidro_Carbonato_Kg: '',
    PP_Hidro_Silice_Kg: '',
    PP_Hidro_Celulosa_Kg: '',
    PP_Hidro_Hidroxido_Kg: '',
    PP_Hidro_Bentonita_Kg: '',
    PP_Hidro_SolReales_porcentage: '',
    PP_Hidro_CelulosaS_porcentage: '',
    PP_Hidro_CelulosaSR_SR_grados: '',
    PP_Refi_EE_AMP: '',
    PP_Refi_CelulosaH_porcentage: '',
    PP_Refi_CelulosaS_porcentage: '',
    PP_Refi_CelulosaSR_SR_grados: '',
    PP_Maq_FlujoFloc_L_min: '',
    PP_Maq_Resi_ml: '',
    PP_Maq_Vueltas_N: '',
    PP_Maq_Vel_m_min: '',
    PP_Maq_FormatoP_PSI: '',
    PP_Maq_FlujoFlocForm_L_Placa: '',
    PP_Maq_VacíoCP_PulgadasHg: '',
    PP_Maq_VacioSF_PulgadasHg: '',
    PP_Maq_Recir__porcentage: '',
    PP_Maq_Fieltro_Dias: '',
    PP_PF_Humedad__porcentage: '',
    PP_PF_Espesor_mm: '',
    PP_PF_Dens_g_cm3: '',
    PP_Maq_FlocCanalS__porcentage: '',
    PP_Maq_FlocTkS__porcentage: '',
    PP_Maq_FlocFormS__porcentage: '',
    PP_MaqTCE_Densidad_g_cm3: '',
    PP_Maq_TCES__porcentage: '',
    PP_Maq_CilinS__porcentage: '',
    PP_Maq_Cono1S__porcentage: '',
    PP_Maq_MolinoS__porcentage: '',
    PP_Maq_P1H__porcentage: '',
    PP_Maq_P3H__porcentage: '',
    machine: '',
    process: ''
  });
  const isFormValid = () => {
    for (const key in valores) {
      if (!valores[key]) {
        return false; // Si un campo está vacío, retorna false
      }
    }
    return true; // Si todos los campos tienen valores, retorna true
  };
  // Función para manejar cambios en los inputs
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Actualizar el estado con el nuevo valor
    setValores({
      ...valores,
      [name]: value,
    });

  };
  const handleSearchChange = (event) => {
    const newValue = event.target.value.toLowerCase(); // Convertir a minúsculas y eliminar espacios en blanco
    setSearchValue(newValue);

    if (newValue === '') {

      setData2(copyData2)
    } else {
      const filtered = copyData2.filter((a) => {
        console.log(a)
        const fullName = a.nombreOriginal.toLowerCase() ; // Concatenar los campos y convertir a minúsculas
        return fullName.includes(newValue);
      });
      console.log(filtered, 'filtro');
    setData2(filtered)

    }
  };

  const [searchValue, setSearchValue] = useState('');
 
  const handleSelectChange = (selectedOption, label) => {
    if (selectedOption && selectedOption.label === "AUT") {
        setValores({
            ...valores,
            ['machine']: 1,
            [label]: selectedOption.value,
        });
    } else {
        setValores({
            ...valores,
            [label]: selectedOption ? selectedOption.value : null,
        });
    }
};


  
  const [contadorTrue, setContadorTrue] = useState(0)

  const [contadorTrue2, setContadorTrue2] = useState(0)



  const [contadorFalse2, setContadorFalse2] = useState(0)
  const [cards2, setCards2] = useState({})

  const [contadorFalse, setContadorFalse] = useState(0)
  const [cards, setCards] = useState({})
  const sendData = async () => {
    setCharging(true)
    console.log(valores)
    let ok = isFormValid()
    if (ok) {
      console.log('ok')
      let response3 = await post_data(valores).catch((e) => {
        console.log(e)
        setCharging(false)
        Swal.fire({
          icon: "error",
          text: "Se produjo un error al hacer los calculos. Revise que todos los campos sean numericos y este el valor de la maquina y el proceso.",
        });
      })
      if (response3) {
        console.log(response3.data)
        const elementosNoNulos = Object.entries(response3.data.resultado).filter(([clave, valor]) => valor !== null).reduce((obj, [clave, valor]) => ({ ...obj, [clave]: valor }), {});
        setCards(elementosNoNulos)


        console.log(elementosNoNulos)
        let trueCount = 0;
        let falseCount = 0;
        
        // Iterar sobre los valores del objeto y contar true y false
        for (const key in elementosNoNulos) {
          if (elementosNoNulos.hasOwnProperty(key)) {
            const valor = elementosNoNulos[key];
            
            // Verificar si la clave no es una de las excluidas
            if (key !== "Separador" && key !== "Manipulación" && key !== "Daño_Estiba") {
              if (valor === true) {
                trueCount++;
              } else if (valor === false) {
                falseCount++;
              }
            }
          }
        }
        setContadorTrue(trueCount)
        setContadorFalse(falseCount)
        setCharging(false)
        toggleManualCharacterization()

      }
    } else {
      setCharging(false)
      Swal.fire({
        icon: "info",
        text: "Debe de llenar todos los campos.",
      });
    }
  }

  const [subList, setSubList] = useState([]);
  

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
            <FontAwesomeIcon className='fs-2- me-2' icon={faArrowUpFromBracket} />
            <h3 className="m-0 p-0 lh-sm fs-2- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">Cargar datos</h3>
          </div>
        </div>
        <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto flex-grow-1 gap-1 d-flex flex-row justify-content-end justify-content-sm-end justify-content-md-end justify-content-lg-end justify-content-xl-end justify-content-xxl-end align-items-center align-self-center mt-4 mt-sm-4 mt-md-0 mt-lg-0 mt-xl-0 mt-xxl-0'>
          <div className='row g-3 g-sm-3 g-md-2 g-lg-2 g-xl-2 g-xxl-2 d-flex flex-row justify-content-center align-items-center align-self-center'>
            <div className="col-auto">
              <button type='button' className="btn-neumorphic- btn-primary-yellow- d-flex flex-row justify-content-center align-items-center align-self-center" data-bs-toggle="modal" data-bs-target="#upload-file"><FontAwesomeIcon className='me-2' icon={faArrowUpFromBracket} size="sm" />
                <span className='lh-1 le-spacing-05- fs-5- font-noto-regular- fw-bold'>Importar datos</span></button>
            </div>
            <div className="col-auto">
              <button type='button'   onClick={descargarXLSX} className="btn-neumorphic- btn-primary-blue- d-flex flex-row justify-content-center align-items-center align-self-center"><i className='fa icon-download-file me-2'></i>
                <span className='lh-1 le-spacing-05- fs-5- font-noto-regular- fw-bold'>Descargar plantilla</span></button>
            </div>
          </div>
        </div>
      </div>
      <div className='row mt-4 mt-sm-4 mt-md-4 mt-lg-4 mt-xl-5 mt-xxl-5'>
        <div id='internal-form' className='col-12'>
          <form action='' className='position-relative'>
            <div className='row mb-4'>
              <div className='col-10 mx-auto'>
                <p className="m-0 p-0 lh-sm fs-4- font-noto-regular- fw-normal tx-tertiary-black- le-spacing-05- text-align-justify-">Selecciona una maquina y un proceso para aplicar el análisis de predicción y clasificación de defectos.</p>
              </div>
            </div>
            <div className='row'>
              <div className='col-10 mx-auto'>
                <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-4'>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6'>
                    <div className='form-floating inner-addon- left-addon-'>
                      <Select id='maq' options={optionsMachine} isDisabled={valores?.process === 1} value={valores.machine?optionsMachine.find(option => option.value === valores.machine):null } onChange={(event) => handleSelectChange(event, 'machine')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Maquina" styles={selectStyles} isClearable={true} name='maq' />
                      <i className='fa icon-id-type fs-xs'></i>
                    </div>
                  </div> 
                  <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6'>
                    <div className='form-floating inner-addon- left-addon-'>
                      <Select id='process'    options={optionsoProcesses} value={valores?.process?optionsoProcesses.find(option=>option.value===valores.process):null} onChange={(event) => handleSelectChange(event, 'process')} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="Proceso" styles={selectStyles} isClearable={true} name='process' />
                      <i className='fa icon-id-type fs-xs'></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row mb-4'>
              <div className='col-10 mx-auto'>
                <p className="m-0 p-0 lh-sm fs-4- font-noto-regular- fw-normal tx-tertiary-black- le-spacing-05- text-align-justify-">Ingresa cada una de las siguientes variables para obtener la debida caracterización de defectos.</p>
              </div>
            </div>
            <div className='row'>
              <div className='col-10 mx-auto'>
                <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-4'>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Hidro_Cemento_Kg' placeholder="PP HIDRO CEMENTO (KG)" name='PP_Hidro_Cemento_Kg' />
                      <label>PP HIDRO CEMENTO (KG)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Hidro_Carbonato_Kg' placeholder="PP HIDRO CARBONATO (KG)" name='PP_Hidro_Carbonato_Kg' />
                      <label>PP HIDRO CARBONATO (KG)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Hidro_Silice_Kg' placeholder="PP HIDRO SILICE (KG)" name='PP_Hidro_Silice_Kg' />
                      <label>PP HIDRO SILICE (KG)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Hidro_Celulosa_Kg' placeholder="PP HIDRO CELULOSA (KG)" name='PP_Hidro_Celulosa_Kg' />
                      <label>PP HIDRO CELULOSA (KG)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Hidro_Hidroxido_Kg' placeholder="PP HIDRO HIDROXIDO (KG)" name='PP_Hidro_Hidroxido_Kg' />
                      <label>PP HIDRO HIDROXIDO (KG)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Hidro_Bentonita_Kg' placeholder="PP HIDRO BENTONITA (KG)" name='PP_Hidro_Bentonita_Kg' />
                      <label>PP HIDRO BENTONITA (KG)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Hidro_SolReales_porcentage' placeholder="PP HIDRO SOL REALES (%)" name='PP_Hidro_SolReales_porcentage' />
                      <label>PP HIDRO SOL REALES (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Hidro_CelulosaS_porcentage' placeholder="PP HIDRO CELULOSA S (%)" name='PP_Hidro_CelulosaS_porcentage' />
                      <label>PP HIDRO CELULOSA S (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Hidro_CelulosaSR_SR_grados' placeholder="PP HIDRO CELULOSA SR (°)" name='PP_Hidro_CelulosaSR_SR_grados' />
                      <label>PP HIDRO CELULOSA SR (°)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Refi_EE_AMP' placeholder="PP REFI EE AMP" name='PP_Refi_EE_AMP' />
                      <label>PP REFI EE AMP</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Refi_CelulosaH_porcentage' placeholder="PP REFI CELULOSA H (%)" name='PP_Refi_CelulosaH_porcentage' />
                      <label>PP REFI CELULOSA H (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Refi_CelulosaS_porcentage' placeholder="PP REFI CELULOSA S (%)" name='PP_Refi_CelulosaS_porcentage' />
                      <label>PP REFI CELULOSA S (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Refi_CelulosaSR_SR_grados' placeholder="PP REFI CELULOSA SR (°)" name='PP_Refi_CelulosaSR_SR_grados' />
                      <label>PP REFI CELULOSA SR (°)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_FlujoFloc_L_min' placeholder="PP MAQ FLUJO FLOC (L/Min)" name='PP_Maq_FlujoFloc_L_min' />
                      <label>PP MAQ FLUJO FLOC (L/MIN)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_Resi_ml' placeholder="PP MAQ RESI (Ml)" name='PP_Maq_Resi_ml' />
                      <label>PP MAQ RESI (Ml)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_Vueltas_N' placeholder="PP MAQ VUELTAS N" name='PP_Maq_Vueltas_N' />
                      <label>PP MAQ VUELTAS N</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_Vel_m_min' placeholder="PP MAQ VEL (M/MIN)" name='PP_Maq_Vel_m_min' />
                      <label>PP MAQ VEL (M/MIN)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_FormatoP_PSI' placeholder="PP MAQ FORMATO P PSI" name='PP_Maq_FormatoP_PSI' />
                      <label>PP MAQ FORMATO P PSI</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_FlujoFlocForm_L_Placa' placeholder="PP MAQ FLUJO FLOC FORM (L/Placa)" name='PP_Maq_FlujoFlocForm_L_Placa' />
                      <label>PP MAQ FLUJO FLOC FORM (L/Placa)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_VacíoCP_PulgadasHg' placeholder="PP MAQ VACIO CP PULGADAS HG" name='PP_Maq_VacíoCP_PulgadasHg' />
                      <label>PP MAQ VACIO CP PULGADAS HG</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_VacioSF_PulgadasHg' placeholder="PP MAQ VACIO SF PULGADAS HG" name='PP_Maq_VacioSF_PulgadasHg' />
                      <label>PP MAQ VACIO SF PULGADAS HG</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_Recir__porcentage' placeholder="PP MAQ RECIR (%)" name='PP_Maq_Recir__porcentage' />
                      <label>PP MAQ RECIR (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_Fieltro_Dias' placeholder="PP MAQ FIELTRO DÍAS" name='PP_Maq_Fieltro_Dias' />
                      <label>PP MAQ FIELTRO DÍAS</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_PF_Humedad__porcentage' placeholder="PP PF HUMEDAD (%)" name='PP_PF_Humedad__porcentage' />
                      <label>PP PF HUMEDAD (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_PF_Espesor_mm' placeholder="PP PF ESPESOR (MM)" name='PP_PF_Espesor_mm' />
                      <label>PP PF ESPESOR (MM)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_PF_Dens_g_cm3' placeholder="PP PF DENS (G/CM3)" name='PP_PF_Dens_g_cm3' />
                      <label>PP PF DENS (G/CM3)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_FlocCanalS__porcentage' placeholder="PP MAQ FLOC CANAL S (%)" name='PP_Maq_FlocCanalS__porcentage' />
                      <label>PP MAQ FLOC CANAL S (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_FlocTkS__porcentage' placeholder="PP MAQ FLOC TKS (%)" name='PP_Maq_FlocTkS__porcentage' />
                      <label>PP MAQ FLOC TKS (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_FlocFormS__porcentage' placeholder="PP MAQ FLOC FORM S (%)" name='PP_Maq_FlocFormS__porcentage' />
                      <label>PP MAQ FLOC FORM S (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_MaqTCE_Densidad_g_cm3' placeholder="PP MAQ TCE DENSIDAD (G/CM3)" name='PP_MaqTCE_Densidad_g_cm3' />
                      <label>PP MAQ TCE DENSIDAD (G/CM3)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_TCES__porcentage' placeholder="PP MAQ TCES (%)" name='PP_Maq_TCES__porcentage' />
                      <label>PP MAQ TCES (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_CilinS__porcentage' placeholder="PP MAQ CILIN S (%)" name='PP_Maq_CilinS__porcentage' />
                      <label>PP MAQ CILIN S (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_Cono1S__porcentage' placeholder="PP MAQ CONO 1S (%)" name='PP_Maq_Cono1S__porcentage' />
                      <label>PP MAQ CONO 1S (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_MolinoS__porcentage' placeholder="PP MAQ MOLINO S (%)" name='PP_Maq_MolinoS__porcentage' />
                      <label>PP MAQ MOLINO S (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_P1H__porcentage' placeholder="PP MAQ P1H (%)" name='PP_Maq_P1H__porcentage' />
                      <label>PP MAQ P1H (%)</label>
                    </div>
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4 mb-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4 mb-xxl-4'>
                    <div className='form-floating'>
                      <input type="number" className='form-control' onChange={handleChange} id='PP_Maq_P3H__porcentage' placeholder="PP MAQ P3H (%)" name='PP_Maq_P3H__porcentage' />
                      <label>PP MAQ P3H (%)</label>
                    </div>
                  </div>
                </div>
                <div className='row gx-2 d-flex flex-row justify-content-end align-items-start align-self-start mt-2 mb-4'>
                  <div className='col-12 col-sm-12 col-md-auto col-lg-auto col-xl-auto col-xxl-auto'>
                    <button type='button' onClick={sendData} className="btn-neumorphic- btn-primary-blue- d-flex flex-row justify-content-center align-items-center align-self-center ps-5 pe-5" data-bs-target="#manual-characterization" aria-controls="manual-characterization">
                      <FontAwesomeIcon className='me-2' icon={faSpinner} size="sm" />
                      <span className='lh-1 le-spacing-05- fs-5- font-noto-regular- fw-bold'>Procesar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className={`offcanvas offcanvas-bottom offcanvas-bottom- manual-characterization- ${showManualCharacterization ? 'show' : ''}`} tabIndex="-1" data-bs-backdrop="false" id="manual-characterization" aria-labelledby="manual-characterization" data-bs-scroll="false">
        <div className="offcanvas-header pt-4 pb-4 ps-2 pe-2 ps-sm-2 pe-sm-2 ps-md-4 pe-md-4 ps-lg-4 pe-lg-4 ps-xl-4 pe-xl-4 ps-xxl-4 pe-xxl-4">
          <h2 className="m-0 ms-3 me-5 p-0 lh-sm fs-2- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">
            Caracterización de defectos - Datos manuales
          </h2>
          <button type="button" className="ms-5 btn-close-offcanvas btn-secondary-blue-" data-bs-dismiss="offcanvas" onClick={toggleManualCharacterization}>
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>
        <div className="offcanvas-body ps-2 pe-2 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3 ps-lg-4 pe-lg-4 ps-xl-4 pe-xl-4 ps-xxl-4 pe-xxl-4">
          <div className="container-fluid">
            <div className='row gx-4 d-flex flex-wrap flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-between justify-content-sm-between justify-content-md-between justify-content-lg-between justify-content-xl-between justify-content-xxl-between align-items-center align-self-center align-self-xxl-center mt-4'>
              <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto d-flex flex-column justify-content-start justify-content-sm-start justify-content-md-start justify-content-lg-start justify-content-xl-start justify-content-xxl-start align-items-center align-self-center'>
                <div className="row mb-3">
                  <div className="col-12">
                    <p className="m-0 p-0 lh-sm fs-3- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">
                      Predicción de características
                    </p>
                  </div>
                </div>
                <div className="row row-cols-auto g-3 d-flex flex-wrap flex-row justify-content-start align-items-center align-self-center me-auto">
                  <div className="col-auto d-flex flex-row justify-content-start align-items-center align-self-center">
                    <div className="p-2 me-2 rounded-circle bg-primary-green-"></div>
                    <p className="m-0 p-0 lh-sm fs-5- font-noto-regular- text-start fw-bold tx-tertiary-black- le-spacing-05-">Buena</p>
                  </div>
                  <div className="col-auto d-flex flex-row justify-content-start align-items-center align-self-center">
                    <div className="p-2 me-2 rounded-circle bg-primary-red-"></div>
                    <p className="m-0 p-0 lh-sm fs-5- font-noto-regular- text-start fw-bold tx-tertiary-black- le-spacing-05-">Mala</p>
                  </div>
                </div>
              </div>
              <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto d-flex flex-column justify-content-end justify-content-sm-end justify-content-md-end justify-content-lg-end justify-content-xl-end justify-content-xxl-end align-items-center align-self-center mt-3 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0 mt-xxl-0'>
                <div className="row mb-3">
                  <div className="col-12">
                    <p className="m-0 p-0 lh-sm fs-3- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">
                      Conteo de fallas
                    </p>
                  </div>
                </div>
                <div className="row row-cols-auto g-3 d-flex flex-wrap flex-row justify-content-start align-items-center align-self-center me-auto">
                  <div className="col-auto d-flex flex-row justify-content-start align-items-center align-self-center">
                    <FontAwesomeIcon className='co-primary-green- me-2' icon={faCircleCheck} size="lg" />
                    <p className="m-0 p-0 lh-sm fs-4- font-noto-regular- text-start fw-bold tx-tertiary-black- le-spacing-05-">{contadorTrue}</p>
                  </div>
                  <div className="col-auto d-flex flex-row justify-content-start align-items-center align-self-center">
                    <FontAwesomeIcon className='co-primary-red- me-2' icon={faCircleXmark} size="lg" />
                    <p className="m-0 p-0 lh-sm fs-4- font-noto-regular- text-start fw-bold tx-tertiary-black- le-spacing-05-">{contadorFalse}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='row row-cols-auto d-flex flex-wrap justify-content-center align-items-start align-self-start justify-content-sm-center align-items-sm-start align-self-sm-start justify-content-md-center align-items-md-start align-self-md-start justify-content-lg-start align-items-lg-start align-self-lg-start justify-content-xl-start align-items-xl-start align-self-xl-start justify-content-xxl-start align-items-xxl-start align-self-xxl-start g-4 mt-4'>

              {cards.Tallon !== undefined && cards.Tallon !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Tallon') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Tallon ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Tallón</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Nudo !== undefined && cards.Nudo !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Nudo') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Nudo ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Nudo</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {cards.Fisura !== undefined && cards.Fisura !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Fisura') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Fisura ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Fisura</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Delaminada !== undefined && cards.Delaminada !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Delaminada') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Delaminada ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Delaminada</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Desborde !== undefined && cards.Desborde !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Desborde') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Desborde ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Desborde</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Ondulación !== undefined && cards.Ondulación !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Ondulación') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Ondulación ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Ondulación</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Burbuja !== undefined && cards.Burbuja !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Burbuja') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Burbuja ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Burbuja</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Despunte !== undefined && cards.Despunte !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Despunte') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Despunte ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Despunte</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Basura !== undefined && cards.Basura !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Basura') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Basura ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Basura</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Mancha !== undefined && cards.Mancha !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Mancha') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Mancha ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Mancha</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Material !== undefined && cards.Material !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Material') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Material ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Material</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Rajada !== undefined && cards.Rajada !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Rajada') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Rajada ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Rajada</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Desmoldeo !== undefined && cards.Desmoldeo !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Desmoldeo') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Desmoldeo ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Desmoldeo</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Desmoldeadora !== undefined && cards.Desmoldeadora !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Desmoldeadora') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Desmoldeadora ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Desmoldeadora</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Mal_Corte !== undefined && cards.Mal_Corte !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Mal_Corte') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Mal_Corte ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Mal corte</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Descolgada !== undefined && cards.Descolgada !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Descolgada') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Descolgada ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Descolgada</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {cards.Mal_Ondulada !== undefined && cards.Mal_Ondulada !== null && (
                <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
                  <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
                    <div className='card border-0 position-relative overflow-hidden'>
                      <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Mal_Ondulada') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
                        <div className='mt-3 wrapper-name-variable-'>
                          <div className={`w-auto pt-1 ${cards.Mal_Ondulada ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
                            <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Mal ondulada</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
           
          </div>
        </div>
      </div>
      <div className={`offcanvas offcanvas-bottom offcanvas-bottom- relevance-characteristics- ${showRelevanceCharacteristics ? 'show' : ''}`} tabIndex="-1" data-bs-backdrop="false" id="relevance-characteristics" aria-labelledby="relevance-characteristics" data-bs-scroll="false">
        <div className="offcanvas-header pt-4 pb-4 ps-2 pe-2 ps-sm-2 pe-sm-2 ps-md-4 pe-md-4 ps-lg-4 pe-lg-4 ps-xl-4 pe-xl-4 ps-xxl-4 pe-xxl-4">
          <h2 className="m-0 ms-3 me-5 p-0 lh-sm fs-2- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">
            Relevancia de características
          </h2>
          <button type="button" className="ms-5 btn-close-offcanvas btn-secondary-blue-" data-bs-dismiss="offcanvas" onClick={toggleRelevanceCharacteristics2}>
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>
        <div className="offcanvas-body ps-2 pe-2 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3 ps-lg-4 pe-lg-4 ps-xl-4 pe-xl-4 ps-xxl-4 pe-xxl-4">
          <div className="container-fluid position-relative">
            <div className='row mt-4 mb-4'>
              <div className='col-auto'>
                <div className='w-auto pt-1 bt-primary-red-'>
                  <h3 className="m-0 p-0 lh-sm fs-3- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">{viendo}</h3>
                </div>
              </div>
            </div>
            <div className='row mt-4 mb-4'>
              <div id='relevance-chart-' className='col-12'>
                <div className='wrapper-relevance-chart- w-100'>
                  <div className='w-100 h-100 mx-auto' id='relevance-characteristics-chart-'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`offcanvas offcanvas-bottom offcanvas-bottom- import-characterization- ${showImportCharacterization ? 'show' : ''}`} tabIndex="-1" data-bs-backdrop="false" id="import-characterization" aria-labelledby="import-characterization" data-bs-scroll="false">
        <div className="offcanvas-header pt-4 pb-4 ps-2 pe-2 ps-sm-2 pe-sm-2 ps-md-4 pe-md-4 ps-lg-4 pe-lg-4 ps-xl-4 pe-xl-4 ps-xxl-4 pe-xxl-4">
          <h2 className="m-0 ms-3 me-5 p-0 lh-sm fs-2- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">
            Caracterización de defectos - Datos importados
          </h2>
          <button type="button" className="ms-5 btn-close-offcanvas btn-secondary-blue-" data-bs-dismiss="offcanvas" onClick={toggleImportCharacterization2}>
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>
        <div className="offcanvas-body ps-2 pe-2 ps-sm-2 pe-sm-2 ps-md-3 pe-md-3 ps-lg-4 pe-lg-4 ps-xl-4 pe-xl-4 ps-xxl-4 pe-xxl-4">
          <div className="container-fluid position-relative">
            <div className='row mt-4 mb-4'>
              <div className='col-12'>
                <form action="" className='position-relative wrapper-search- d-block d-sm-block d-md-block d-lg-block d-xl-block d-xxl-block'>
                  <div className='form-search inner-addon- left-addon-'>
                    <input type="text" className='form-control search-'  value={searchValue}
  onChange={(e) => handleSearchChange(e)} id="buscador-modulos" placeholder="Buscar" />
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </div>
                </form>
              </div>
            </div>
            <div className='row mt-4'>
              <div className='col-12 d-flex flex-row justify-content-end align-items-center align-self-center'>
                <form id='internal-form' action='' className='position-relative'>
                  <div className='row gx-0 gx-sm-0 gx-md-4 gx-lg-4 gx-xl-4 gx-xxl-5'>
                    <div className='col-auto d-flex flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-center align-items-center align-self-center me-auto'>
                      <div className='form-floating inner-addon- left-addon-'>
                        <Select id='select-registers' options={SelectRegisters} onChange={cambiarItems} components={{ ValueContainer: CustomValueContainer, animatedComponents, NoOptionsMessage: customNoOptionsMessage, LoadingMessage: customLoadingMessage }} placeholder="# registros" styles={selectRegistersStyles} isClearable={true} name='maq' />
                        <i className='fa icon-id-type fs-xs'></i>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className='row mb-2'>
              <div className='col-12'>
                <div className='table-responsive table-general-'>
                  <table className='table table-sm table-striped table-bordered border-light table-rounded- align-middle mb-1'>
                    <thead>
                      <tr>
                        <th scope="col" className='th-width-xs-'>
                          <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                            <span className='fs-6-'></span>
                          </div>
                        </th>
                        <th scope="col" className='th-width-auto-'>
                          <div className='d-flex flex-row justify-content-center align-items-center align-self-center w-100'>
                            <span className='fs-6-'>Nombre</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>

                    {slicedLotes && slicedLotes.map((elem) => (
                       <tr key={elem.id}>
                        <td className='align-middle'>
                          <div className='w-auto d-flex flex-row justify-content-center align-items-center align-self-center'>
                            <div className='checks-radios-'>
                              <label>
                              <input
                  type="checkbox"
                  name="radio"
                  checked={seleccionActual === elem}
                  onChange={() => manejarSeleccion(elem)}
                />
                                <span className='lh-sm fs-5- ff-monse-regular- tx-dark-purple-'></span>
                              </label>
                            </div>
                          </div>
                        </td>
                        <td className='align-middle'>
                          <p className='m-0 lh-sm fs-5- text-start'>{elem?.nombreOriginal}</p>
                        </td>
                      </tr>
                    ))}
                     
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className='row mt-4 mb-4'>
              <div className='col-12 d-flex flex-row justify-content-center align-items-center align-self-center'>
                <Pagination
                  pageCount={pageCount}
                  pageIndex={pageIndex}
                  setPageIndex={setPageIndex}
                />
              </div>
            </div>

            {seleccionActual && (
              <><div className='row gx-4 d-flex flex-wrap flex-row flex-sm-row flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-between justify-content-sm-between justify-content-md-between justify-content-lg-between justify-content-xl-between justify-content-xxl-between align-items-center align-self-center align-self-xxl-center mt-5'>
                <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto d-flex flex-column justify-content-start justify-content-sm-start justify-content-md-start justify-content-lg-start justify-content-xl-start justify-content-xxl-start align-items-center align-self-center'>
                  <div className="row mb-3">
                    <div className="col-12">
                      <p className="m-0 p-0 lh-sm fs-3- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">
                        Predicción de características
                      </p>
                    </div>
                  </div>
                  <div className="row row-cols-auto g-3 d-flex flex-wrap flex-row justify-content-start align-items-center align-self-center me-auto">
                    <div className="col-auto d-flex flex-row justify-content-start align-items-center align-self-center">
                      <div className="p-2 me-2 rounded-circle bg-primary-green-"></div>
                      <p className="m-0 p-0 lh-sm fs-5- font-noto-regular- text-start fw-bold tx-tertiary-black- le-spacing-05-">Buena</p>
                    </div>
                    <div className="col-auto d-flex flex-row justify-content-start align-items-center align-self-center">
                      <div className="p-2 me-2 rounded-circle bg-primary-red-"></div>
                      <p className="m-0 p-0 lh-sm fs-5- font-noto-regular- text-start fw-bold tx-tertiary-black- le-spacing-05-">Mala</p>
                    </div>
                  </div>
                </div>
                <div className='col-auto col-sm-auto col-md-auto col-lg-auto col-xl-auto col-xxl-auto d-flex flex-column justify-content-end justify-content-sm-end justify-content-md-end justify-content-lg-end justify-content-xl-end justify-content-xxl-end align-items-center align-self-center mt-3 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0 mt-xxl-0'>
                  <div className="row mb-3">
                    <div className="col-12">
                      <p className="m-0 p-0 lh-sm fs-3- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1-">
                        Conteo de fallas
                      </p>
                    </div>
                  </div>
                  <div className="row row-cols-auto g-3 d-flex flex-wrap flex-row justify-content-start align-items-center align-self-center me-auto">
                    <div className="col-auto d-flex flex-row justify-content-start align-items-center align-self-center">
                      <FontAwesomeIcon className='co-primary-green- me-2' icon={faCircleCheck} size="lg" />
                      <p className="m-0 p-0 lh-sm fs-4- font-noto-regular- text-start fw-bold tx-tertiary-black- le-spacing-05-">{contadorTrue2}</p>
                    </div>
                    <div className="col-auto d-flex flex-row justify-content-start align-items-center align-self-center">
                      <FontAwesomeIcon className='co-primary-red- me-2' icon={faCircleXmark} size="lg" />
                      <p className="m-0 p-0 lh-sm fs-4- font-noto-regular- text-start fw-bold tx-tertiary-black- le-spacing-05-">{contadorFalse2}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row row-cols-auto d-flex flex-wrap justify-content-center align-items-start align-self-start justify-content-sm-center align-items-sm-start align-self-sm-start justify-content-md-center align-items-md-start align-self-md-start justify-content-lg-start align-items-lg-start align-self-lg-start justify-content-xl-start align-items-xl-start align-self-xl-start justify-content-xxl-start align-items-xxl-start align-self-xxl-start g-4 mt-4'>

{cards2.Tallon !== undefined && cards2.Tallon !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Tallon') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Tallon ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Tallón</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Nudo !== undefined && cards2.Nudo !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Nudo') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Nudo ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Nudo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{cards2.Fisura !== undefined && cards2.Fisura !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Fisura') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Fisura ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Fisura</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Delaminada !== undefined && cards2.Delaminada !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Delaminada') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Delaminada ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Delaminada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Desborde !== undefined && cards2.Desborde !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Desborde') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Desborde ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Desborde</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Ondulación !== undefined && cards2.Ondulación !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Ondulación') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Ondulación ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Ondulación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Burbuja !== undefined && cards2.Burbuja !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Burbuja') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Burbuja ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Burbuja</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Despunte !== undefined && cards2.Despunte !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Despunte') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Despunte ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Despunte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Basura !== undefined && cards2.Basura !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Basura') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Basura ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Basura</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Mancha !== undefined && cards2.Mancha !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Mancha') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Mancha ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Mancha</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Material !== undefined && cards2.Material !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Material') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Material ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Material</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Rajada !== undefined && cards2.Rajada !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Rajada') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Rajada ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Rajada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Desmoldeo !== undefined && cards2.Desmoldeo !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Desmoldeo') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Desmoldeo ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Desmoldeo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Desmoldeadora !== undefined && cards2.Desmoldeadora !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Desmoldeadora') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Desmoldeadora ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Desmoldeadora</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Mal_Corte !== undefined && cards2.Mal_Corte !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Mal_Corte') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Mal_Corte ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Mal corte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Descolgada !== undefined && cards2.Descolgada !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Descolgada') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Descolgada ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Descolgada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{cards2.Mal_Ondulada !== undefined && cards2.Mal_Ondulada !== null && (
  <div className='col d-flex flex-column justify-content-center align-items-center align-self-start wrapper-variable-card-'>
    <div id="variable-card" className='w-100 d-flex flex-row justify-content-center align-items-center align-self-center cursor-'>
      <div className='card border-0 position-relative overflow-hidden'>
        <div className='w-100 h-100 d-flex flex-row justify-content-center align-items-center align-self-center' type="button" onClick={() => { toggleRelevanceCharacteristics('Mal_Ondulada') }} data-bs-target="#relevance-characteristics" aria-controls="relevance-characteristics">
          <div className='mt-3 wrapper-name-variable-'>
            <div className={`w-auto pt-1 ${cards2.Mal_Ondulada ? 'bt-primary-green-' : 'bt-primary-red-'}`}>
              <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- text-center text-uppercase fw-bold tx-tertiary-black- le-spacing-05-'>Mal ondulada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
</div>
                
                
                </>
            )}
            

          </div>
        </div>
      </div>
      <div className='modal animated fade fast' id="upload-file" tabIndex="-1" aria-labelledby="exampleModalCenterTitle"    aria-hidden="true">
        <div className='modal-dialog modal-dialog-centered' role="document">
          <div className='modal-content p-0 ps-4 pe-4'>
            <div className='modal-header'>
              <button type="button" className="btn-close btn-secondary-blue-" onClick={()=>setSelectedFile(null)}  ref={btnCloseRef} data-bs-dismiss="modal" aria-label="Close">
                <FontAwesomeIcon icon={faXmark} size="md" />
              </button>
            </div>
            <div className='modal-body position-relative'>
              <div className='row'>
                <div className='col-12'>
                  <h3 className='m-0 p-0 lh-sm fs-3- font-oswald-regular- text-uppercase text-start fw-bold tx-primary-blue- le-spacing-1- text-center'>¡Subir archivo!</h3>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='col-12'>
                  <p className='m-0 p-0 lh-sm fs-5- font-noto-regular- fw-normal tx-primary-blue- le-spacing-05- text-center'>Adjunta el archivo para realizar la predicción de fallas.</p>
                </div>
              </div>
              <div className='row mt-4 mb-3'>
                <div className='col-12'>
                  <form id='internal-form' className='w-100" autocomplete="nope'>
                    <div className='row g-0 g-sm-0 g-md-2 g-lg-2 g-xl-2 g-xxl-2'>
                      <div className='col-12 d-flex flex-column justify-content-center align-items-center align-self-center'>
                        <div id="test-drop-area" className='file-drop-area- position-relative overflow-hidden'>
                          <img className='card-img position-absolute top-50 start-50 translate-middle' src={DropArea} alt="" />
                          <div className='d-flex flex-column justify-content-center align-items-center align-self-center w-100 text-wrap p-3'>
                            <img className='image-upload- mx-auto mb-4' src={UploadIcon} alt="" />
                            <p className='mb-1 p-0 lh-sm text-center fs-5- font-noto-regular- fw-normal tx--quaternary-gray-'>Arrastre y suelte el archivo aquí</p>
                            <p className='m-0 p-0 lh-sm text-center fs-5- font-noto-regular- fw-normal tx-black-'>o <span className='tx-secondary-blue-'>seleccione un archivo</span> de su computadora</p>
                            <input className='file-input-drop-' type="file" onChange={handleFileChange} multiple={false} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {selectedFile && (
                <div className='row'>
                <div className='col-12'>
                  <p className='m-0 p-0 lh-sm text-center fs-6- font-noto-regular- fw-normal tx--quaternary-gray-'>Nombre del archivo: {selectedFile.name}</p>
                </div>
              </div>
              )}
              
              <div className='row mt-2'>
                <div className='col-12'>
                  <p className='m-0 p-0 lh-sm text-center fs-6- font-noto-regular- fw-normal tx-black-'>Tipo de archivos permitidos: xlsx</p>
                </div>
              </div>
              {selectedFile && (
              <div className='row gx-2 d-flex flex-row justify-content-center align-items-start align-self-start mt-4 mb-2'>
                <div className='col-auto'>
                  <button type='button' className="btn-neumorphic- btn-primary-blue- d-flex flex-row justify-content-center align-items-center align-self-center ps-5 pe-5" onClick={toggleImportCharacterization} data-bs-target="#import-characterization" aria-controls="import-characterization">
                    <FontAwesomeIcon className='me-2' icon={faArrowUpFromBracket} size="sm" />
                    <span className='lh-1 le-spacing-05- fs-5- font-noto-regular- fw-bold'>Subir</span>
                  </button>
                </div>
              </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
