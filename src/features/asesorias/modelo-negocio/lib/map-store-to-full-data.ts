import type { ModeloNegocioState } from '@/features/asesorias/modelo-negocio/types/wizard-form.type'
import type { FichaContexto } from '@/features/asesorias/modelo-negocio/types/ficha.type'
import type { CatalogoItem } from '@/types/catalog.type'
import type { ModeloNegocioFullData } from '@/types/modelo-negocio-full.type'
import { calculateFinancialProjection } from '@/features/asesorias/modelo-negocio/utils/financial-projection'

export function mapStoreToFullData(
  formData: ModeloNegocioState,
  contexto: FichaContexto,
  catalogs: {
    categoriasInsumo: CatalogoItem[]
    unidadesMedida: CatalogoItem[]
    categoriasInversion: CatalogoItem[]
  }
): ModeloNegocioFullData {
  const lookupCat = (id: number | null) =>
    catalogs.categoriasInsumo.find((c) => c.id === id)?.descripcion ??
    String(id ?? '')
  const lookupUnidad = (id: number | null) =>
    catalogs.unidadesMedida.find((u) => u.id === id)?.descripcion ??
    String(id ?? '')
  const lookupInversion = (id: number | null) =>
    catalogs.categoriasInversion.find((c) => c.id === id)?.descripcion ??
    String(id ?? '')

  const costosVariables = formData.costos.insumos
    .filter((inf) => inf.categoriaId !== null && inf.descripcion.trim() !== '')
    .map((inf) => ({
      categoria: lookupCat(inf.categoriaId),
      descripcion: inf.descripcion,
      cantidad: Number(inf.cantidad) || 0,
      unidad: lookupUnidad(inf.unidadId),
      costoUnitario: Number(inf.costoUnit) || 0,
    }))

  const costosFijos = formData.costos.fijos
    .filter((cf) => cf.detalle.trim() !== '')
    .map((cf) => ({
      detalle: cf.detalle,
      valor: Number(cf.valor) || 0,
    }))

  const inversionInicial = formData.costos.inversion
    .filter((inv) => inv.descripcion.trim() !== '')
    .map((inv) => ({
      categoria: lookupInversion(inv.categoriaId),
      descripcion: inv.descripcion,
      costo: Number(inv.costo) || 0,
    }))

  const supuestos = formData.costos.proyeccion
  const proyeccion = calculateFinancialProjection(supuestos)

  return {
    ficha: {
      n_tramite: formData.ficha.numeroTramite,
      nombre_emprendimiento: contexto.nombreEmprendimiento ?? '',
      analista: formData.ficha.analista,
      producto_linea: formData.ficha.productoLinea,
      observaciones: formData.ficha.observaciones,
      nombreEmprendedor: contexto.nombreEmprendedor,
      cedula: contexto.cedula,
      contacto: contexto.contacto,
      correo: contexto.correo,
      fechaIngreso: contexto.fechaIngreso,
      sector: contexto.sector,
      direccion: contexto.direccion,
    },
    introduccion: {
      texto: formData.introduccion.introduccion,
      importancia: formData.introduccion.importancia,
    },
    contexto: {
      antecedentes: formData.antecedentes.antecedentes,
      justificacion: formData.justificacion.justificacion,
      objetivo_general: formData.objetivos.objetivoGeneral,
    },
    objetivosEspecificos: formData.objetivos.objetivosEspecificos.filter(
      (o) => o.trim() !== ''
    ),
    conclusiones: formData.conclusiones.conclusiones || null,
    canvas: {
      segmentos: formData.segmentos.segmentos,
      canales: formData.canales.canales,
      relacion_clientes: formData.relacion.relacion,
    },
    foda: {
      fortalezas: formData.anexos.fortalezas,
      oportunidades: formData.anexos.oportunidades,
      debilidades: formData.anexos.debilidades,
      amenazas: formData.anexos.amenazas,
    },
    propuestaValor: formData.propuesta.propuestaValor,
    propuestaProductos: formData.propuesta.portafolio
      .filter((p) => p.trim() !== '')
      .map((p) => ({ producto: p, descripcion: '', precio: 0 })),
    fuenteIngreso: formData.ingresos.ingresosTexto || null,
    portafolioProductos: formData.ingresos.productos
      .filter((p) => p.producto.trim() !== '')
      .map((p) => ({
        producto: p.producto,
        precio: Number(p.precio) || 0,
        peso: null,
      })),
    recursosActividades: {
      recursosFinancieros: formData.recursos.recursosFinancieros,
      recursosFisicos: formData.recursos.recursosFisicos,
      mobiliario: formData.recursos.mobiliario,
      local: formData.recursos.local,
      actividades: formData.actividades.actividades,
      socios: formData.socios.socios,
    },
    costosVariables,
    costosFijos,
    inversionInicial,
    proyeccion,
  }
}
