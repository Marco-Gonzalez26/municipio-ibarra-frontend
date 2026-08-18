import { catalogService } from '@/features/registro-emprendedor/services/catalog.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import type { FichaContexto } from '../types/ficha.type'

export const fichaContextoService = {
  getByEmprendedorId: async (
    idEmprendedor: number,
    token: string,
    idFormularioRef?: number
  ): Promise<FichaContexto> => {
    const formularioLimit = idFormularioRef ? 500 : 1
    const [emprendedor, formulariosRes, sectoresCatalogo] = await Promise.all([
      entrepreneurService.getById(idEmprendedor, token),
      entrepeneurFormService.getAllReferenciaGeneral(
        1,
        formularioLimit,
        token,
        idEmprendedor
      ),
      catalogService.getEnterpriseSector(token),
    ])

    const formulario = idFormularioRef
      ? formulariosRes.formularios_referencia_general.find(
          (item) => item.id === idFormularioRef
        ) ?? null
      : formulariosRes.formularios_referencia_general[0] ?? null

    let sector: string | null = null
    let idSector: number | null = null
    if (formulario) {
      const sectoresRes = await entrepeneurFormService.getRefSectorByFormulario(
        formulario.id,
        token
      )
      const sectorAsignado = sectoresRes.formularios_ref_sector[0] ?? null
      if (sectorAsignado) {
        idSector = sectorAsignado.id_sector
        sector =
          sectorAsignado.sector_otro ??
          sectoresCatalogo.data.find(
            (item) => item.id === sectorAsignado.id_sector
          )?.descripcion ??
          null
      }
    }

    return {
      idEmprendedor: emprendedor.id,
      idFormularioRef: formulario?.id ?? null,
      nombreEmprendedor: emprendedor.nombres_apellidos,
      cedula: emprendedor.cedula,
      contacto: emprendedor.celular,
      correo: emprendedor.email,
      fechaIngreso: formulario?.fecha_formulario ?? emprendedor.fecha_registro,
      nombreEmprendimiento: formulario?.nombre_emprendimiento ?? null,
      idSector,
      sector,
      direccion: emprendedor.parroquia || null,
    }
  },
}
