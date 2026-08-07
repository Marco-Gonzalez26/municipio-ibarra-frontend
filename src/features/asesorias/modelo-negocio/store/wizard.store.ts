import { create } from 'zustand'
import { toast } from 'sonner'
import type { FichaContexto } from '../types/ficha.type'
import type {
  ModeloNegocioState,
  WizardStep,
} from '../types/wizard-form.type'
import { WIZARD_STEPS } from '../types/wizard-form.type'
import { initialState } from './initial-state'
import { saveStepAction, createModeloAction } from '@/features/modelo-negocio/actions/modelo-negocio.actions'

const STEP_ORDER: WizardStep[] = WIZARD_STEPS.map((step) => step.key)

interface ModeloNegocioWizardStoreState {
  modeloNegocioId: number | null
  idEmprendedor: number | null
  contexto: FichaContexto | null
  currentStep: WizardStep
  isDirty: boolean
  formData: ModeloNegocioState

  setModeloNegocioId: (id: number | null) => void
  ensureEmprendedor: (idEmprendedor: number, contexto: FichaContexto) => void
  setCurrentStep: (step: WizardStep) => void
  goToNextStep: () => Promise<void>
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

  hydrateFromServer: (data: {
    modeloNegocioId: number
    formData: ModeloNegocioState
    currentStep: WizardStep
  }) => void

  saveCurrentStep: () => Promise<void>

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
      isDirty: true,
      formData: {
        ...state.formData,
        [key]: { ...state.formData[key], ...data },
      },
    }))
}

export const useModeloNegocioWizardStore =
  create<ModeloNegocioWizardStoreState>()((set, get) => ({
    modeloNegocioId: null,
    idEmprendedor: null,
    contexto: null,
    currentStep: 'ficha',
    isDirty: false,
    formData: initialState.formData,

    setModeloNegocioId: (id) => set({ modeloNegocioId: id }),

    ensureEmprendedor: (idEmprendedor, contexto) => {
      if (get().idEmprendedor === idEmprendedor) {
        set({ contexto })
        return
      }
      set({
        modeloNegocioId: null,
        idEmprendedor,
        contexto,
        currentStep: 'ficha',
        isDirty: false,
        formData: initialState.formData,
      })
    },

    setCurrentStep: (step) => set({ currentStep: step }),

    goToNextStep: async () => {
      const { currentStep } = get()
      await get().saveCurrentStep()
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

    hydrateFromServer: (data) => {
      set({
        modeloNegocioId: data.modeloNegocioId,
        currentStep: data.currentStep,
        formData: data.formData,
        isDirty: false,
      })
    },

    saveCurrentStep: async () => {
      const { modeloNegocioId, currentStep, formData, contexto } = get()

      let activeId = modeloNegocioId

      if (!activeId) {
        if (!contexto) {
          toast.error('No hay emprendimiento seleccionado')
          return
        }
        try {
          const result = await createModeloAction(
            formData.ficha.numeroTramite,
            contexto.fechaIngreso,
            contexto.nombreEmprendimiento ?? contexto.nombreEmprendedor,
            contexto.idSector ?? 1,
            formData.ficha.productoLinea,
            formData.ficha.analista,
            formData.ficha.observaciones
          )
          activeId = result.modelo_negocio.id
          set({ modeloNegocioId: activeId })
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Error al crear modelo'
          toast.error(`Error al crear modelo: ${message}`)
          return
        }
      }

      try {
        await saveStepAction(activeId, currentStep, formData)
        set({ isDirty: false })
        toast.success('Guardado correctamente')
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Error al guardar'
        toast.error(`Error al guardar: ${message}`)
      }
    },

    reset: () =>
      set({
        modeloNegocioId: null,
        currentStep: 'ficha',
        formData: initialState.formData,
        idEmprendedor: null,
        isDirty: false,
        contexto: null,
      }),
  }))
