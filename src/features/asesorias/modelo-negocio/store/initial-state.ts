import type { ModeloNegocioState } from '../types/wizard-form.type'

export const initialState: ModeloNegocioState = {
  ficha: {
    numeroTramite: '',
    productoLinea: '',
    analista: '',
    observaciones: '',
  },
  introduccion: {
    introduccion: '',
    importancia: '',
  },
  antecedentes: {
    antecedentes: '',
  },
  justificacion: {
    justificacion: '',
  },
  objetivos: {
    objetivoGeneral: '',
    objetivosEspecificos: [],
  },
  propuesta: {
    propuestaValor: '',
    portafolio: [],
  },
  segmentos: {
    segmentos: '',
  },
  canales: {
    canales: '',
  },
  relacion: {
    relacion: '',
  },
  ingresos: {
    ingresosTexto: '',
    productos: [],
  },
  recursos: {
    recursosFinancieros: '',
    recursosFisicos: '',
    mobiliario: '',
    local: '',
  },
  actividades: {
    actividades: '',
  },
  socios: {
    socios: '',
  },
  costos: {
    insumos: [],
    fijos: [],
    inversion: [],
    proyeccion: {
      precio: 0,
      costosFijos: 0,
      growth: 0,
      startUnits: 0,
      varRatio: 0,
      margen: 0,
    },
  },
  conclusiones: {
    conclusiones: '',
  },
  anexos: {
    fortalezas: '',
    oportunidades: '',
    debilidades: '',
    amenazas: '',
  },
}
