import type { ModeloNegocioState, WizardStep } from '../types/wizard-form.type'
import { WIZARD_STEPS } from '../types/wizard-form.type'

function hasText(value: string | undefined | null) {
  return Boolean(value && value.trim().length > 0)
}

const STEP_VALIDATORS: Record<
  WizardStep,
  (formData: ModeloNegocioState) => boolean
> = {
  ficha: ({ ficha }) =>
    hasText(ficha.numeroTramite) &&
    hasText(ficha.productoLinea) &&
    hasText(ficha.analista),
  introduccion: ({ introduccion }) =>
    hasText(introduccion.introduccion) && hasText(introduccion.importancia),
  antecedentes: ({ antecedentes }) => hasText(antecedentes.antecedentes),
  justificacion: ({ justificacion }) => hasText(justificacion.justificacion),
  objetivos: ({ objetivos }) => hasText(objetivos.objetivoGeneral),
  propuesta: ({ propuesta }) => hasText(propuesta.propuestaValor),
  segmentos: ({ segmentos }) => hasText(segmentos.segmentos),
  canales: ({ canales }) => hasText(canales.canales),
  relacion: ({ relacion }) => hasText(relacion.relacion),
  ingresos: ({ ingresos }) => hasText(ingresos.ingresosTexto),
  recursos: ({ recursos }) =>
    hasText(recursos.recursosFinancieros) &&
    hasText(recursos.recursosFisicos) &&
    hasText(recursos.mobiliario) &&
    hasText(recursos.local),
  actividades: ({ actividades }) => hasText(actividades.actividades),
  socios: ({ socios }) => hasText(socios.socios),
  costos: () => true,
  conclusiones: ({ conclusiones }) => hasText(conclusiones.conclusiones),
  anexos: ({ anexos }) =>
    hasText(anexos.fortalezas) &&
    hasText(anexos.oportunidades) &&
    hasText(anexos.debilidades) &&
    hasText(anexos.amenazas),
}

export function isStepComplete(step: WizardStep, formData: ModeloNegocioState) {
  return STEP_VALIDATORS[step](formData)
}

export function getIncompleteSteps(formData: ModeloNegocioState) {
  return WIZARD_STEPS.filter((step) => !isStepComplete(step.key, formData))
}
