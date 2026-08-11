'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useModeloNegocioWizardStore } from '../store/wizard.store'
import type { FichaContexto } from '../types/ficha.type'
import type { WizardStep } from '../types/wizard-form.type'
import { WizardStepper } from './wizard-stepper'
import type { StepHandle } from './step-shell'
import { FichaStep } from './ficha-step'
import { IntroduccionStep } from './introduccion-step'
import { AntecedentesStep } from './antecedentes-step'
import { JustificacionStep } from './justificacion-step'
import { ObjetivosStep } from './objetivos-step'
import { PropuestaStep } from './propuesta-step'
import { SegmentosStep } from './segmentos-step'
import { CanalesStep } from './canales-step'
import { RelacionStep } from './relacion-step'
import { IngresosStep } from './ingresos-step'
import { RecursosStep } from './recursos-step'
import { ActividadesStep } from './actividades-step'
import { SociosStep } from './socios-step'
import { CostosStep } from './costos-step'
import { ConclusionesStep } from './conclusiones-step'
import { AnexosStep } from './anexos-step'
import { loadModeloAction } from '@/features/modelo-negocio/actions/modelo-negocio.actions'
import type { ModeloNegocioState } from '../types/wizard-form.type'

interface ModeloNegocioWizardProps {
  idEmprendedor: number
  contexto: FichaContexto
  modeloNegocioId?: number | null
  analistaNombre?: string
}

function mapServerSectionsToFormData(
  sections: Record<string, unknown>,
  modelo: {
    n_tramite?: string | null
    producto_linea?: string | null
    analista?: string | null
    observaciones?: string | null
  }
): ModeloNegocioState {
  const intro = sections.introduccion as {
    introduccion: string
    importancia: string
  } | null
  const ctx = sections.contexto as {
    antecedentes: string
    justificacion: string
    impacto: string
    objetivo_general: string
  } | null
  const propuesta = sections.propuestaValor as {
    propuesta_valor: string
  } | null
  const objetivosEsp = sections.objetivosEspecificos as Array<{
    id: number
    descripcion: string
    orden: number
  }> | null
  const propProductos = sections.propuestaProductos as Array<{
    id: number
    nombre: string
    codigo_producto: string
  }> | null
  const cc = sections.clientesCanales as {
    segmentos: string
    canales: string
    relacion: string
  } | null
  const ra = sections.recursosActividades as {
    recursos_financieros: string
    recursos_fisicos: string
    mobiliario: string
    local: string
    actividades: string
    socios: string
  } | null
  const conc = sections.conclusiones as { conclusiones: string } | null
  const foda = sections.foda as Array<{
    id_cuadrante: number
    contenido: string
  }> | null

  const costosVar = sections.costosVariables as Array<{
    id_categoria: number
    descripcion: string
    cantidad: number
    id_unidad: number | null
    costo_unitario: number
  }> | null
  const costosFij = sections.costosFijos as Array<{
    detalle: string
    valor: number
  }> | null
  const inversion = sections.inversionInicial as Array<{
    id_categoria: number
    descripcion: string
    costo: number
  }> | null
  const proj = sections.proyeccionSupuestos as {
    precio: number
    costos_fijos: number
    crecimiento: number
    start_units: number
    var_ratio: number
    margen: number
  } | null
  const fuentes = sections.fuentesIngreso as Array<{
    fuente_ingreso: string
    monto_estimado: number | null
  }> | null
  const portafolio = sections.portafolioProductos as Array<{
    codigo_producto: string | null
    orden: number
    precio: number
    peso: number | null
  }> | null

  const fodaMap: Record<number, string> = {}
  if (foda) {
    for (const item of foda) {
      fodaMap[item.id_cuadrante] = item.contenido
    }
  }

  return {
    ficha: {
      numeroTramite: modelo?.n_tramite ?? '',
      productoLinea: modelo?.producto_linea ?? '',
      analista: modelo?.analista ?? '',
      observaciones: modelo?.observaciones ?? '',
    },
    introduccion: {
      introduccion: intro?.introduccion ?? '',
      importancia: intro?.importancia ?? '',
    },
    antecedentes: {
      antecedentes: ctx?.antecedentes ?? '',
    },
    justificacion: {
      justificacion: ctx?.justificacion ?? '',
    },
    objetivos: {
      objetivoGeneral: ctx?.objetivo_general ?? '',
      objetivosEspecificos: objetivosEsp
        ? objetivosEsp.map((o) => o.descripcion)
        : [],
    },
    propuesta: {
      propuestaValor: propuesta?.propuesta_valor ?? '',
      portafolio: propProductos ? propProductos.map((p) => p.nombre) : [],
    },
    segmentos: {
      segmentos: cc?.segmentos ?? '',
    },
    canales: {
      canales: cc?.canales ?? '',
    },
    relacion: {
      relacion: cc?.relacion ?? '',
    },
    ingresos: {
      ingresosTexto: fuentes?.[0]?.fuente_ingreso ?? '',
      productos:
        portafolio
          ?.sort((a, b) => a.orden - b.orden)
          .map((p) => ({
            producto: p.codigo_producto ?? '',
            descripcion: '',
            precio: p.precio,
          })) ?? [],
    },
    recursos: {
      recursosFinancieros: ra?.recursos_financieros ?? '',
      recursosFisicos: ra?.recursos_fisicos ?? '',
      mobiliario: ra?.mobiliario ?? '',
      local: ra?.local ?? '',
    },
    actividades: {
      actividades: ra?.actividades ?? '',
    },
    socios: {
      socios: ra?.socios ?? '',
    },
    costos: {
      insumos:
        costosVar?.map((c) => ({
          categoriaId: c.id_categoria,
          descripcion: c.descripcion,
          cantidad: c.cantidad,
          unidadId: c.id_unidad,
          costoUnit: c.costo_unitario,
        })) ?? [],
      fijos:
        costosFij?.map((f) => ({
          detalle: f.detalle,
          valor: f.valor,
        })) ?? [],
      inversion:
        inversion?.map((i) => ({
          categoriaId: i.id_categoria,
          descripcion: i.descripcion,
          costo: i.costo,
        })) ?? [],
      proyeccion: {
        precio: proj?.precio ?? 0,
        costosFijos: proj?.costos_fijos ?? 0,
        growth: proj?.crecimiento ?? 0,
        startUnits: proj?.start_units ?? 0,
        costoVariableUnitario: proj?.var_ratio ?? 0,
        margen: proj?.margen ?? 0,
        annualFixedCostIncrease: 0,
      },
    },
    conclusiones: {
      conclusiones: conc?.conclusiones ?? '',
    },
    anexos: {
      fortalezas: fodaMap[1] ?? '',
      oportunidades: fodaMap[2] ?? '',
      debilidades: fodaMap[3] ?? '',
      amenazas: fodaMap[4] ?? '',
    },
  }
}

export function ModeloNegocioWizard({
  idEmprendedor,
  contexto,
  modeloNegocioId: initialModeloId,
  analistaNombre,
}: ModeloNegocioWizardProps) {
  const [loading, setLoading] = useState(false)
  const loadedRef = useRef(false)
  const ensureEmprendedor = useModeloNegocioWizardStore(
    (state) => state.ensureEmprendedor
  )
  const hydrateFromServer = useModeloNegocioWizardStore(
    (state) => state.hydrateFromServer
  )

  useEffect(() => {
    ensureEmprendedor(idEmprendedor, contexto)
  }, [idEmprendedor, contexto, ensureEmprendedor])

  const loadModelo = useCallback(async () => {
    if (!initialModeloId || loadedRef.current) return
    loadedRef.current = true
    setLoading(true)
    try {
      const data = await loadModeloAction(initialModeloId)
      const formData = mapServerSectionsToFormData(data.sections, data.modelo)
      const stepMap: Record<string, WizardStep> = {
        ficha: 'ficha',
        introduccion: 'introduccion',
        antecedentes: 'antecedentes',
        justificacion: 'justificacion',
        objetivos: 'objetivos',
        propuesta: 'propuesta',
        segmentos: 'segmentos',
        canales: 'canales',
        relacion: 'relacion',
        ingresos: 'ingresos',
        recursos: 'recursos',
        actividades: 'actividades',
        socios: 'socios',
        costos: 'costos',
        conclusiones: 'conclusiones',
        anexos: 'anexos',
      }
      const targetStep = stepMap[data.firstIncompleteStep] ?? 'ficha'

      hydrateFromServer({
        modeloNegocioId: data.modelo.id,
        formData,
        currentStep: targetStep,
      })
    } catch (error) {
      console.error('Error loading modelo:', error)
    } finally {
      setLoading(false)
    }
  }, [initialModeloId, hydrateFromServer])

  useEffect(() => {
    loadModelo()
  }, [loadModelo])

  const currentStep = useModeloNegocioWizardStore((state) => state.currentStep)
  const setCurrentStep = useModeloNegocioWizardStore(
    (state) => state.setCurrentStep
  )
  const goToNextStep = useModeloNegocioWizardStore(
    (state) => state.goToNextStep
  )
  const goToPreviousStep = useModeloNegocioWizardStore(
    (state) => state.goToPreviousStep
  )

  const stepRef = useRef<StepHandle>(null)
  const isSaving = useModeloNegocioWizardStore((state) => state.isSaving)

  async function handleStepClick(step: WizardStep) {
    if (step === currentStep || isSaving) return
    await stepRef.current?.saveDraft()
    setCurrentStep(step)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Cargando modelo de negocio...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <WizardStepper
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {currentStep === 'ficha' ? (
          <FichaStep
            ref={stepRef}
            contexto={contexto}
            analistaNombre={analistaNombre}
            onNext={goToNextStep}
          />
        ) : null}
        {currentStep === 'introduccion' ? (
          <IntroduccionStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'antecedentes' ? (
          <AntecedentesStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'justificacion' ? (
          <JustificacionStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'objetivos' ? (
          <ObjetivosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'propuesta' ? (
          <PropuestaStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'segmentos' ? (
          <SegmentosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'canales' ? (
          <CanalesStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'relacion' ? (
          <RelacionStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'ingresos' ? (
          <IngresosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'recursos' ? (
          <RecursosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'actividades' ? (
          <ActividadesStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'socios' ? (
          <SociosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'costos' ? (
          <CostosStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'conclusiones' ? (
          <ConclusionesStep
            ref={stepRef}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ) : null}
        {currentStep === 'anexos' ? (
          <AnexosStep
            ref={stepRef}
            onPrevious={goToPreviousStep}
            onGoToStep={setCurrentStep}
          />
        ) : null}
      </div>
    </div>
  )
}
