import { create } from 'zustand'
import type {
  WizardMode,
  RegistroEmprendedorState,
  WizardStep,
} from '../types/wizard-form.type'

const REGISTER_STEP_ORDER: WizardStep[] = [
  'pago',
  'datos-personales',
  'situacion-actual',
  'intenciones',
  'emprendimiento',
  'asistencia-tecnica',
]

const EXISTING_ENTREPRENEUR_STEP_ORDER: WizardStep[] = [
  'pago',
  'intenciones',
  'emprendimiento',
  'asistencia-tecnica',
]

const initialState: RegistroEmprendedorState = {
  pago: {
    valor_pago_inicial: null,
    codigo_pago: '',
  },
  datosPersonales: {
    nombres: '',
    apellidos: '',
    cedula: '',
    email: '',
    celular: '',
    nacionalidad: '',
    fecha_nacimiento: '',
    ciudad: '',
    parroquia: '',
    barrio_comunidad: '',
    calle_principal: '',
    calle_secundaria: '',
    numero_casa: '',
    id_estado_civil: null,
    id_rango_edad: null,
    tiene_discapacidad: false,
    id_tipo_discapacidad: null,
    porcentaje_discapacidad: '',
    numero_carnet_discapacidad: '',
    cantidad_cargas_familiares: 0,
    cargas_con_discapacidad: 0,
    id_genero: null,
    id_etnia: null,
    etnia_otra: '',
    id_nivel_estudios: null,
    titulo_profesional: '',
  },
  situacionActual: {
    id_ocupacion: null,
    ocupacion_otra: '',
    id_nivel_ingresos: null,
    tiene_emprendimiento: false,
    pertenece_asociatividad: false,
  },
  intenciones: {
    desea_emprender: false,
    motivacion_emprender: '',
    sectores_interes: [],
  },
  emprendimiento: {
    nombre_emprendimiento: '',
    anio_creacion: null,
    descripcion: '',
    id_sector: null,
    id_tipo: null,
    recursos_disponibles: [],
    desea_mejorar: false,
    motivo_mejora: '',
  },
  asistenciaTecnica: {
    areas_asistencia: [],
    observaciones: '',
  },
}

interface WizardStoreState {
  mode: WizardMode
  currentStep: WizardStep
  formData: RegistroEmprendedorState

  setMode: (mode: WizardMode) => void
  setCurrentStep: (step: WizardStep) => void
  goToNextStep: () => void
  goToPreviousStep: () => void

  updatePersonalData: (
    data: Partial<RegistroEmprendedorState['datosPersonales']>
  ) => void
  updateCurrentSituation: (
    data: Partial<RegistroEmprendedorState['situacionActual']>
  ) => void
  updateIntentions: (
    data: Partial<RegistroEmprendedorState['intenciones']>
  ) => void
  updateEnterprise: (
    data: Partial<RegistroEmprendedorState['emprendimiento']>
  ) => void
  updateTechnicalAssistance: (
    data: Partial<RegistroEmprendedorState['asistenciaTecnica']>
  ) => void

  updatePayment: (data: Partial<RegistroEmprendedorState['pago']>) => void

  // true si el usuario ya tiene un emprendimiento (paso 2)
  hasEnterprise: () => boolean

  resetForMode: (mode: WizardMode) => void
  reset: () => void
}

export const useWizardStore = create<WizardStoreState>((set, get) => ({
  mode: 'registro',
  currentStep: 'pago',
  formData: initialState,

  setMode: (mode) => set({ mode }),
  setCurrentStep: (step) => set({ currentStep: step }),

  goToNextStep: () => {
    const { currentStep, mode } = get()
    const stepOrder =
      mode === 'emprendimiento-existente'
        ? EXISTING_ENTREPRENEUR_STEP_ORDER
        : REGISTER_STEP_ORDER
    const currentIndex = stepOrder.indexOf(currentStep)
    const nextIndex = currentIndex + 1

    if (nextIndex < stepOrder.length) {
      set({ currentStep: stepOrder[nextIndex] })
    }
  },

  goToPreviousStep: () => {
    const { currentStep, mode } = get()
    const stepOrder =
      mode === 'emprendimiento-existente'
        ? EXISTING_ENTREPRENEUR_STEP_ORDER
        : REGISTER_STEP_ORDER
    const currentIndex = stepOrder.indexOf(currentStep)
    const prevIndex = currentIndex - 1

    if (prevIndex >= 0) {
      set({ currentStep: stepOrder[prevIndex] })
    }
  },

  updatePersonalData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        datosPersonales: { ...state.formData.datosPersonales, ...data },
      },
    })),

  updateCurrentSituation: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        situacionActual: { ...state.formData.situacionActual, ...data },
      },
    })),

  updateIntentions: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        intenciones: { ...state.formData.intenciones, ...data },
      },
    })),

  updateEnterprise: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        emprendimiento: { ...state.formData.emprendimiento, ...data },
      },
    })),

  updateTechnicalAssistance: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        asistenciaTecnica: { ...state.formData.asistenciaTecnica, ...data },
      },
    })),

  updatePayment: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        pago: { ...state.formData.pago, ...data },
      },
    })),
  hasEnterprise: () => get().formData.situacionActual.tiene_emprendimiento,

  reset: () => set({ currentStep: 'datos-personales', formData: initialState }),

  resetForMode: (mode) =>
    set({
      mode,
      currentStep: 'pago',
      formData:
        mode === 'emprendimiento-existente'
          ? {
              ...initialState,
              situacionActual: {
                ...initialState.situacionActual,
                tiene_emprendimiento: true,
              },
            }
          : initialState,
    }),
}))
