import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FichaContexto } from '../types/ficha.type'
import type {
  ModeloNegocioEstado,
  ModeloNegocioRegistro,
  ModeloNegocioState,
  WizardStep,
} from '../types/wizard-form.type'
import { WIZARD_STEPS } from '../types/wizard-form.type'
import { initialState } from './initial-state'

const STEP_ORDER: WizardStep[] = WIZARD_STEPS.map((step) => step.key)

interface ModeloNegocioWizardStoreState {
  idEmprendedor: number | null
  contexto: FichaContexto | null
  currentStep: WizardStep
  formData: ModeloNegocioState
  registro: Record<number, ModeloNegocioRegistro>

  ensureEmprendedor: (idEmprendedor: number, contexto: FichaContexto) => void
  registrarProgreso: (estado: ModeloNegocioEstado) => void
  setCurrentStep: (step: WizardStep) => void
  goToNextStep: () => void
  goToPreviousStep: () => void

  updateFicha: (data: Partial<ModeloNegocioState['ficha']>) => void
  updateIntroduccion: (
    data: Partial<ModeloNegocioState['introduccion']>
  ) => void
  updateAntecedentes: (
    data: Partial<ModeloNegocioState['antecedentes']>
  ) => void
  updateJustificacion: (
    data: Partial<ModeloNegocioState['justificacion']>
  ) => void
  updateObjetivos: (data: Partial<ModeloNegocioState['objetivos']>) => void
  updatePropuesta: (data: Partial<ModeloNegocioState['propuesta']>) => void
  updateSegmentos: (data: Partial<ModeloNegocioState['segmentos']>) => void
  updateCanales: (data: Partial<ModeloNegocioState['canales']>) => void
  updateRelacion: (data: Partial<ModeloNegocioState['relacion']>) => void
  updateIngresos: (data: Partial<ModeloNegocioState['ingresos']>) => void
  updateRecursos: (data: Partial<ModeloNegocioState['recursos']>) => void
  updateActividades: (data: Partial<ModeloNegocioState['actividades']>) => void
  updateSocios: (data: Partial<ModeloNegocioState['socios']>) => void
  updateCostos: (data: Partial<ModeloNegocioState['costos']>) => void
  updateConclusiones: (
    data: Partial<ModeloNegocioState['conclusiones']>
  ) => void
  updateAnexos: (data: Partial<ModeloNegocioState['anexos']>) => void

  reset: () => void
}

type SetFn = (
  partial: (
    state: ModeloNegocioWizardStoreState
  ) => Partial<ModeloNegocioWizardStoreState>
) => void

function makeUpdater<K extends keyof ModeloNegocioState>(set: SetFn, key: K) {
  return (data: Partial<ModeloNegocioState[K]>) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: { ...state.formData[key], ...data },
      },
    }))
}

export const useModeloNegocioWizardStore =
  create<ModeloNegocioWizardStoreState>()(
    persist(
      (set, get) => ({
        idEmprendedor: null,
        contexto: null,
        currentStep: 'ficha',
        formData: initialState,
        registro: {},

        ensureEmprendedor: (idEmprendedor, contexto) => {
          if (get().idEmprendedor === idEmprendedor) {
            set({ contexto })
            return
          }
          const existente = get().registro[idEmprendedor]
          set({
            idEmprendedor,
            contexto,
            currentStep: 'ficha',
            formData: existente ? existente.formData : initialState,
          })
        },

        registrarProgreso: (estado) => {
          const { idEmprendedor, contexto, formData, registro } = get()
          if (idEmprendedor === null) return
          set({
            registro: {
              ...registro,
              [idEmprendedor]: {
                idEmprendedor,
                nombreEmprendedor: contexto?.nombreEmprendedor ?? 'Sin nombre',
                nombreEmprendimiento: contexto?.nombreEmprendimiento ?? null,
                estado,
                actualizadoEn: new Date().toISOString(),
                formData,
              },
            },
          })
        },

        setCurrentStep: (step) => set({ currentStep: step }),

        goToNextStep: () => {
          const { currentStep } = get()
          const nextIndex = STEP_ORDER.indexOf(currentStep) + 1
          if (nextIndex < STEP_ORDER.length) {
            set({ currentStep: STEP_ORDER[nextIndex] })
          }
        },

        goToPreviousStep: () => {
          const { currentStep } = get()
          const prevIndex = STEP_ORDER.indexOf(currentStep) - 1
          if (prevIndex >= 0) {
            set({ currentStep: STEP_ORDER[prevIndex] })
          }
        },

        updateFicha: makeUpdater(set, 'ficha'),
        updateIntroduccion: makeUpdater(set, 'introduccion'),
        updateAntecedentes: makeUpdater(set, 'antecedentes'),
        updateJustificacion: makeUpdater(set, 'justificacion'),
        updateObjetivos: makeUpdater(set, 'objetivos'),
        updatePropuesta: makeUpdater(set, 'propuesta'),
        updateSegmentos: makeUpdater(set, 'segmentos'),
        updateCanales: makeUpdater(set, 'canales'),
        updateRelacion: makeUpdater(set, 'relacion'),
        updateIngresos: makeUpdater(set, 'ingresos'),
        updateRecursos: makeUpdater(set, 'recursos'),
        updateActividades: makeUpdater(set, 'actividades'),
        updateSocios: makeUpdater(set, 'socios'),
        updateCostos: makeUpdater(set, 'costos'),
        updateConclusiones: makeUpdater(set, 'conclusiones'),
        updateAnexos: makeUpdater(set, 'anexos'),

        reset: () =>
          set({
            currentStep: 'ficha',
            formData: initialState,
            idEmprendedor: null,
          }),
      }),
      { name: 'modelo-negocio-wizard' }
    )
  )
