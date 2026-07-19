import { catalogService } from '@/features/registro-emprendedor/services/catalog.service'
import { entrepeneurFormService } from '@/features/registro-emprendedor/services/entrepreneur-form.service'
import { entrepreneurService } from '@/features/registro-emprendedor/services/entrepreneur.service'
import type { FichaContexto } from '../types/ficha.type'

// Caso "Chullabolo" del documento de referencia. Sirve de respaldo mientras
// hasta que en el frontend se implemente la autenticación y se pueda obtener el token de acceso para consultar el backend.
function buildFallbackContexto(idEmprendedor: number): FichaContexto {
  return {
    idEmprendedor,
    nombreEmprendedor: 'Nancy Evelyn Vasquez Hernandez',
    cedula: '1003261623',
    contacto: '0997251584',
    correo: 'nancyvsqz@gmail.com',
    fechaIngreso: '2025-11-11',
    nombreEmprendimiento: 'Chullabolo',
    sector: 'Artesanal',
    direccion: 'El Sagrario',
    datosSimulados: true,
  }
}

export const fichaContextoService = {
  getByEmprendedorId: async (idEmprendedor: number): Promise<FichaContexto> => {
    try {
      const [emprendedor, formulariosRes, sectoresCatalogo] = await Promise.all(
        [
          entrepreneurService.getById(idEmprendedor),
          entrepeneurFormService.getAllReferenciaGeneral(1, 1, idEmprendedor),
          catalogService.getEnterpriseSector(),
        ]
      )

      const formulario =
        formulariosRes.formularios_referencia_general[0] ?? null

      let sector: string | null = null
      if (formulario) {
        const sectoresRes =
          await entrepeneurFormService.getRefSectorByFormulario(formulario.id)
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
        fechaIngreso:
          formulario?.fecha_formulario ?? emprendedor.fecha_registro,
        nombreEmprendimiento: formulario?.nombre_emprendimiento ?? null,
        sector,
        direccion: emprendedor.parroquia || null,
        datosSimulados: false,
      }
    } catch {
      return buildFallbackContexto(idEmprendedor)
    }
  },
}
