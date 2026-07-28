import { catalogService } from '@/features/registro-emprendedor/services/catalog.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import type { FichaContexto } from '../types/ficha.type'

export const fichaContextoService = {
  getByEmprendedorId: async (
    idEmprendedor: number,
    token: string
  ): Promise<FichaContexto> => {
    const [emprendedor, formulariosRes, sectoresCatalogo] = await Promise.all([
      entrepreneurService.getById(idEmprendedor, token),
      entrepeneurFormService.getAllReferenciaGeneral(
        1,
        1,
        token,
        idEmprendedor
      ),
      catalogService.getEnterpriseSector(token),
    ])

    const formulario = formulariosRes.formularios_referencia_general[0] ?? null

    let sector: string | null = null
    if (formulario) {
      const sectoresRes = await entrepeneurFormService.getRefSectorByFormulario(
        formulario.id,
        token
      )
      const sectorAsignado = sectoresRes.formularios_ref_sector[0] ?? null
      if (sectorAsignado) {
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
      nombreEmprendedor: emprendedor.nombres_apellidos,
      cedula: emprendedor.cedula,
      contacto: emprendedor.celular,
      correo: emprendedor.email,
      fechaIngreso: formulario?.fecha_formulario ?? emprendedor.fecha_registro,
      nombreEmprendimiento: formulario?.nombre_emprendimiento ?? null,
      sector,
      direccion: emprendedor.parroquia || null,
    }
  },
}
