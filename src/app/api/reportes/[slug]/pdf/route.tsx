import { renderToBuffer } from '@react-pdf/renderer'
import { getSession } from '@/features/auth/services/session.service'
import {
  buildReportPayload,
  ReportNotFoundError,
} from '@/features/reportes/services/reportes.service'
import { ReportDocument } from '@/features/reportes/pdf/report-document'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function parseDateParam(value: string | null): string | undefined {
  if (!value || !DATE_PATTERN.test(value)) return undefined
  return value
}

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getSession()
  if (!session) {
    return Response.json({ msg: 'No hay una sesión activa.' }, { status: 401 })
  }

  const { slug } = await params
  const { searchParams } = new URL(request.url)

  const filters = {
    desde: parseDateParam(searchParams.get('desde')),
    hasta: parseDateParam(searchParams.get('hasta')),
    emprendedorId: searchParams.get('emprendedorId') ?? undefined,
    formularioId: searchParams.get('formularioId') ?? undefined,
  }

  let payload
  try {
    payload = await buildReportPayload(slug, filters, session.token)
  } catch (error) {
    if (error instanceof ReportNotFoundError) {
      return Response.json({ msg: error.message }, { status: 404 })
    }

    console.error(`Error al generar el reporte "${slug}"`, error)
    return Response.json(
      { msg: 'No se pudo generar el reporte.' },
      { status: 500 }
    )
  }

  const buffer = await renderToBuffer(<ReportDocument payload={payload} />)

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-${slug}.pdf"`,
    },
  })
}
