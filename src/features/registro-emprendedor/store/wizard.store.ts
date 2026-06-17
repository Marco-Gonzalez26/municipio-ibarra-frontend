import { create } from 'zustand'
import type {
  RegistroEmprendedorState,
  WizardStep,
} from '../types/wizard-form.type'

const STEP_ORDER: WizardStep[] = [
  'datos-personales',
  'situacion-actual',
  'intenciones',
  'emprendimiento',
  'asistencia-tecnica',
]

const initialState: RegistroEmprendedorState = {
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
  currentStep: WizardStep
  formData: RegistroEmprendedorState

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

  // true si el usuario ya tiene un emprendimiento (paso 2)
  hasEnterprise: () => boolean

  reset: () => void
}

export const useWizardStore = create<WizardStoreState>((set, get) => ({
  currentStep: 'datos-personales',
  formData: initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  goToNextStep: () => {
    const { currentStep } = get()
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    const nextIndex = currentIndex + 1

    if (nextIndex < STEP_ORDER.length) {
      set({ currentStep: STEP_ORDER[nextIndex] })
    }
  },

  goToPreviousStep: () => {
    const { currentStep } = get()
    const currentIndex = STEP_ORDER.indexOf(currentStep)
    const prevIndex = currentIndex - 1

    if (prevIndex >= 0) {
      set({ currentStep: STEP_ORDER[prevIndex] })
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

  hasEnterprise: () => get().formData.situacionActual.tiene_emprendimiento,

  reset: () => set({ currentStep: 'datos-personales', formData: initialState }),
}))
