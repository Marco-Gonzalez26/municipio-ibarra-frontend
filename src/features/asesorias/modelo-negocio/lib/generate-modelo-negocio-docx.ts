import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  ImageRun,
  ShadingType,
  VerticalAlign,
  convertInchesToTwip,
  type IParagraphOptions,
} from 'docx'
import type { ModeloNegocioFullData } from '@/types/modelo-negocio-full.type'

// ── Constants ──────────────────────────────────────────────────────

const NAVY = '2E4057'
const ALT_ROW = 'F0F4F8'
const RED = 'CC0000'

const PAGE_TOP = convertInchesToTwip(1)
const PAGE_BOTTOM = convertInchesToTwip(1)
const PAGE_LEFT = convertInchesToTwip(1)
const PAGE_RIGHT = convertInchesToTwip(1)

const NOTA =
  'Nota: Elaboración propia con información proporcionada por el emprendedor'

// ── Helpers ────────────────────────────────────────────────────────

function textOrPlaceholder(value: string | null | undefined): string {
  return value && value.trim() !== '' ? value : 'Información no disponible'
}

function para(text: string, options?: Partial<IParagraphOptions>): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text })],
    spacing: { after: 120 },
    ...options,
  })
}

function h(
  text: string,
  level: (typeof HeadingLevel)[keyof typeof HeadingLevel]
): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true })],
    heading: level,
    spacing: { before: 240, after: 120 },
  })
}

function nota(): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: NOTA, italics: true, size: 18 })],
    spacing: { before: 80, after: 200 },
  })
}

function caption(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 20 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 80 },
  })
}

interface CellOptions {
  bold?: boolean
  align?: (typeof AlignmentType)[keyof typeof AlignmentType]
  width?: number
  fontSize?: number
  margins?: { top?: number; bottom?: number; left?: number; right?: number }
}

function headerCell(text: string, options?: CellOptions): TableCell {
  const fontSize = options?.fontSize ?? 20
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text, bold: true, color: 'FFFFFF', size: fontSize }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
    shading: { type: ShadingType.CLEAR, fill: NAVY },
    verticalAlign: VerticalAlign.CENTER,
    margins: options?.margins ?? { top: 80, bottom: 80, left: 120, right: 120 },
  })
}

function dataCell(
  text: string,
  index: number,
  options?: CellOptions
): TableCell {
  const fontSize = options?.fontSize ?? 20
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: options?.bold, size: fontSize })],
        alignment: options?.align ?? AlignmentType.CENTER,
      }),
    ],
    shading:
      index >= 0
        ? {
            type: ShadingType.CLEAR,
            fill: index % 2 === 0 ? 'FFFFFF' : ALT_ROW,
          }
        : undefined,
    width: options?.width
      ? { size: options.width, type: WidthType.PERCENTAGE }
      : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: options?.margins ?? { top: 60, bottom: 60, left: 120, right: 120 },
  })
}

function emptyCell(options?: CellOptions): TableCell {
  return new TableCell({
    children: [
      new Paragraph({ children: [], alignment: AlignmentType.CENTER }),
    ],
    verticalAlign: VerticalAlign.CENTER,
    margins: options?.margins ?? { top: 60, bottom: 60, left: 120, right: 120 },
  })
}

// ── Image loader ───────────────────────────────────────────────────

interface LoadedImage {
  data: Uint8Array
  width: number
  height: number
}

function parsePngSize(
  bytes: Uint8Array
): { width: number; height: number } | null {
  // PNG signature is 8 bytes; IHDR data chunk starts at offset 16 (width: 4 bytes, height: 4 bytes)
  if (bytes.length < 24) return null
  if (bytes[0] !== 0x89 || bytes[1] !== 0x50) return null
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return {
    width: view.getUint32(16),
    height: view.getUint32(20),
  }
}

async function loadLogo(url: string): Promise<LoadedImage | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const data = new Uint8Array(buf)
    const size = parsePngSize(data)
    return {
      data,
      width: size?.width ?? 100,
      height: size?.height ?? 100,
    }
  } catch {
    return null
  }
}

function scaleToHeight(img: LoadedImage, targetHeight: number) {
  const ratio = img.width / img.height
  return { width: Math.round(targetHeight * ratio), height: targetHeight }
}

// ── Cover page ─────────────────────────────────────────────────────

function createCoverPage(
  data: ModeloNegocioFullData,
  logoEscudo?: LoadedImage | null,
  logoEscudo2?: LoadedImage | null
): (Paragraph | Table)[] {
  const year = new Date().getFullYear()
  const items: (Paragraph | Table)[] = []

  // Logos header
  const logoChildren: (ImageRun | Paragraph)[] = []
  const logoHeight = 100
  if (logoEscudo) {
    logoChildren.push(
      new ImageRun({
        data: logoEscudo.data,
        transformation: scaleToHeight(logoEscudo, logoHeight),
        type: 'png',
      })
    )
  }
  if (logoEscudo2) {
    logoChildren.push(
      new ImageRun({
        data: logoEscudo2.data,
        transformation: scaleToHeight(logoEscudo2, logoHeight),
        type: 'png',
      })
    )
  }

  if (logoChildren.length > 0) {
    items.push(
      new Paragraph({
        children: logoChildren,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    )
  }

  // Titles
  items.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'DIRECCIÓN DE GESTIÓN DE DESARROLLO ECONÓMICO Y SOCIAL',
          bold: true,
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  )
  items.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'UNIDAD DE DESARROLLO ECONÓMICO LOCAL',
          bold: true,
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  )

  // Main title
  items.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'MODELO DE NEGOCIOS',
          bold: true,
          size: 48,
          color: RED,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  )
  items.push(
    new Paragraph({
      children: [
        new TextRun({
          text: textOrPlaceholder(data.ficha.nombre_emprendimiento),
          bold: true,
          size: 36,
          color: RED,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  )
  items.push(
    new Paragraph({
      children: [
        new TextRun({
          text: textOrPlaceholder(data.ficha.nombreEmprendedor),
          bold: true,
          size: 32,
          color: RED,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    })
  )

  // Approval heading
  items.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'REGISTRO DE APROBACIÓN DEL DOCUMENTO',
          bold: true,
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  )

  // Approval table (pushed directly, not inside Paragraph)
  items.push(
    new Table({
      alignment: AlignmentType.CENTER,
      width: { size: 80, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            headerCell('RUBRO'),
            headerCell('NOMBRE'),
            headerCell('CARGO'),
            headerCell('FIRMA'),
          ],
        }),
        new TableRow({
          children: [
            dataCell('ELABORADO POR', -1, { bold: true }),
            dataCell(textOrPlaceholder(data.ficha.analista), -1),
            dataCell('', -1),
            emptyCell(),
          ],
        }),
        new TableRow({
          children: [
            dataCell('REVISADO POR', -1, { bold: true }),
            dataCell('', -1),
            dataCell('', -1),
            emptyCell(),
          ],
        }),
        new TableRow({
          children: [
            dataCell('APROBADO POR', -1, { bold: true }),
            dataCell('', -1),
            dataCell('', -1),
            emptyCell(),
          ],
        }),
      ],
    })
  )

  // Year
  items.push(
    new Paragraph({
      children: [
        new TextRun({ text: String(year), bold: true, size: 48, color: RED }),
      ],
      alignment: AlignmentType.CENTER,
    })
  )

  return items
}

// ── Table of contents ──────────────────────────────────────────────

function createTableOfContents(): (Paragraph | Table)[] {
  const entries = [
    '1. Introducción ...................................... 5',
    '2. Antecedentes del Emprendimiento .................. 6',
    '3. Justificación ..................................... 7',
    '4. Objetivo General ................................. 8',
    '5. Desarrollo del Modelo de Negocio ................. 9',
    '    5.1 Propuesta de Valor .......................... 9',
    '    Portafolio de Productos ......................... 10',
    '    5.2 Segmentos de Clientes ....................... 12',
    '    5.3 Canales de Distribución ..................... 13',
    '    5.4 Relación con Clientes ....................... 13',
    '    5.5 Fuentes de Ingreso .......................... 14',
    '    5.6 Recursos Clave .............................. 15',
    '    5.7 Actividades Clave ........................... 16',
    '    5.8 Socios Clave ................................ 18',
    '    5.9 Estructura de Costos ........................ 18',
    '6. Conclusiones ..................................... 23',
    '7. Anexos .......................................... 24',
  ]

  return [
    h('Contenido', HeadingLevel.HEADING_1),
    ...entries.map(
      (entry) =>
        new Paragraph({
          children: [new TextRun({ text: entry, size: 22 })],
          spacing: { after: 60 },
        })
    ),
  ]
}

// ── Ficha page ─────────────────────────────────────────────────────

function createFichaPage(data: ModeloNegocioFullData): (Paragraph | Table)[] {
  const f = data.ficha
  const rowEntries: Array<[string, string]> = [
    ['Nombre del Emprendimiento', f.nombre_emprendimiento],
    ['Nombre del Emprendedor', f.nombreEmprendedor],
    ['CI', f.cedula],
    ['Contacto', f.contacto],
    ['Fecha de ingreso', f.fechaIngreso],
    ['N° Trámite', f.n_tramite],
    ['Sector', f.sector ?? ''],
    ['Producto', f.producto_linea],
    ['Correo', f.correo],
    ['Dirección del Emprendimiento', f.direccion ?? ''],
    ['Observaciones', f.observaciones],
  ]

  const table = new Table({
    alignment: AlignmentType.CENTER,
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rowEntries.map(
      ([label, value], i) =>
        new TableRow({
          children: [
            dataCell(label, i, { bold: true, width: 35 }),
            dataCell(textOrPlaceholder(value), i, { width: 65 }),
          ],
        })
    ),
  })

  return [
    h(`FICHA DEL EMPRENDIMIENTO ${f.n_tramite}`, HeadingLevel.HEADING_1),
    table,
  ]
}

// ── Introducción (with "Importancia del documento") ────────────────

function createIntroduccion(
  data: ModeloNegocioFullData
): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = []
  items.push(h('1. Introducción', HeadingLevel.HEADING_1))

  const texto = data.introduccion?.texto
  items.push(para(textOrPlaceholder(texto)))

  if (data.introduccion?.importancia) {
    items.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Importancia del documento',
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
      })
    )
    items.push(para(textOrPlaceholder(data.introduccion.importancia)))
  }

  return items
}

// ── Section 4: Objetivo ───────────────────────────────────────────

function createObjetivo(data: ModeloNegocioFullData): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = []
  items.push(h('4. Objetivo General', HeadingLevel.HEADING_1))

  const objetivo = data.contexto?.objetivo_general
  items.push(para(textOrPlaceholder(objetivo)))

  const especificos = data.objetivosEspecificos ?? []
  if (especificos.length > 0) {
    items.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '4.1. Objetivos Específicos',
            bold: true,
            size: 24,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
      })
    )
    especificos.forEach((obj, i) => {
      items.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${i + 1}. ${textOrPlaceholder(obj)}`,
              size: 22,
            }),
          ],
          spacing: { after: 80 },
        })
      )
    })
  } else {
    items.push(para('Información no disponible'))
  }

  return items
}

// ── Section 5: Modelo de Negocio (all sub-sections flowing) ───────

function createModeloNegocioSection(
  data: ModeloNegocioFullData
): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = []
  items.push(h('5. Desarrollo del Modelo de Negocio', HeadingLevel.HEADING_1))

  // 5.1 Propuesta de Valor
  items.push(h('5.1 Propuesta de Valor', HeadingLevel.HEADING_2))
  items.push(para(textOrPlaceholder(data.propuestaValor)))

  // Portafolio de Productos (inside 5.1)
  const propProductos = data.propuestaProductos ?? []
  if (propProductos.length > 0) {
    items.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Portafolio de Productos',
            bold: true,
            size: 22,
          }),
        ],
        spacing: { before: 120, after: 80 },
      })
    )
    propProductos.forEach((p) => {
      items.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `\u2022 ${textOrPlaceholder(p.producto)}`,
              size: 22,
            }),
          ],
          spacing: { after: 40 },
        })
      )
    })
  }

  // 5.2 Segmentos de Clientes
  items.push(h('5.2 Segmentos de Clientes', HeadingLevel.HEADING_2))
  items.push(para(textOrPlaceholder(data.canvas?.segmentos)))

  // 5.3 Canales de Distribución
  items.push(h('5.3 Canales de Distribución', HeadingLevel.HEADING_2))
  items.push(para(textOrPlaceholder(data.canvas?.canales)))

  // 5.4 Relación con Clientes
  items.push(h('5.4 Relación con Clientes', HeadingLevel.HEADING_2))
  items.push(para(textOrPlaceholder(data.canvas?.relacion_clientes)))

  // 5.5 Fuentes de Ingreso
  items.push(h('5.5 Fuentes de Ingreso', HeadingLevel.HEADING_2))
  items.push(para(textOrPlaceholder(data.fuenteIngreso)))
  if (data.portafolioProductos && data.portafolioProductos.length > 0) {
    items.push(caption('Tabla 1'))
    items.push(
      new Table({
        alignment: AlignmentType.CENTER,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [headerCell('Producto'), headerCell('Precio (USD)')],
          }),
          ...data.portafolioProductos.map(
            (p, i) =>
              new TableRow({
                children: [
                  dataCell(textOrPlaceholder(p.producto), i),
                  dataCell(`$${(Number(p.precio) || 0).toFixed(2)}`, i, {
                    align: AlignmentType.RIGHT,
                  }),
                ],
              })
          ),
        ],
      })
    )
    items.push(nota())
  } else {
    items.push(para('Información no disponible'))
  }

  // 5.6 Recursos Clave
  items.push(h('5.6 Recursos Clave', HeadingLevel.HEADING_2))
  if (data.recursosActividades) {
    const r = data.recursosActividades

    items.push(
      para(
        'Para el correcto funcionamiento del emprendimiento se requiere contar con los siguientes recursos clave.'
      )
    )

    items.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Recursos financieros', bold: true, size: 22 }),
        ],
        spacing: { before: 120, after: 80 },
      })
    )
    items.push(para(textOrPlaceholder(r.recursosFinancieros)))

    items.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Recursos materiales \u2013 físicos',
            bold: true,
            size: 22,
          }),
        ],
        spacing: { before: 120, after: 80 },
      })
    )
    items.push(para(textOrPlaceholder(r.recursosFisicos)))

    items.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Mobiliario funcional', bold: true, size: 22 }),
        ],
        spacing: { before: 120, after: 80 },
      })
    )
    items.push(para(textOrPlaceholder(r.mobiliario)))

    items.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Nuestro local', bold: true, size: 22 }),
        ],
        spacing: { before: 120, after: 80 },
      })
    )
    items.push(para(textOrPlaceholder(r.local)))
  } else {
    items.push(para('Información no disponible'))
  }

  // 5.7 Actividades Clave
  items.push(h('5.7 Actividades Clave', HeadingLevel.HEADING_2))
  items.push(para(textOrPlaceholder(data.recursosActividades?.actividades)))

  // 5.8 Socios Clave
  items.push(h('5.8 Socios Clave', HeadingLevel.HEADING_2))
  items.push(para(textOrPlaceholder(data.recursosActividades?.socios)))

  // 5.9 Estructura de Costos
  items.push(...createCostosSection(data))

  return items
}

// ── Costos section with tables ─────────────────────────────────────

function createCostosSection(
  data: ModeloNegocioFullData
): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = []
  items.push(h('5.9 Estructura de Costos', HeadingLevel.HEADING_2))

  // Costos variables
  items.push(h('Costos Variables', HeadingLevel.HEADING_3))
  items.push(
    para(
      'Para el funcionamiento del emprendimiento se requieren los siguientes costos variables, calculados en función de las unidades estimadas de producción y venta.'
    )
  )
  if (data.costosVariables && data.costosVariables.length > 0) {
    items.push(caption('Tabla 2 – Detalle de insumos y materiales'))
    items.push(
      new Table({
        alignment: AlignmentType.CENTER,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              headerCell('Categoría'),
              headerCell('Descripción'),
              headerCell('Cantidad estimada'),
              headerCell('Costo unitario (USD)'),
              headerCell('Costo total (USD)'),
            ],
          }),
          ...data.costosVariables.map(
            (cv, i) =>
              new TableRow({
                children: [
                  dataCell(textOrPlaceholder(cv.categoria), i),
                  dataCell(textOrPlaceholder(cv.descripcion), i),
                  dataCell(
                    `${cv.cantidad} ${textOrPlaceholder(cv.unidad)}`,
                    i,
                    {
                      align: AlignmentType.RIGHT,
                    }
                  ),
                  dataCell(
                    `$${(Number(cv.costoUnitario) || 0).toFixed(2)}`,
                    i,
                    {
                      align: AlignmentType.RIGHT,
                    }
                  ),
                  dataCell(
                    `$${((Number(cv.cantidad) || 0) * (Number(cv.costoUnitario) || 0)).toFixed(2)}`,
                    i,
                    { align: AlignmentType.RIGHT }
                  ),
                ],
              })
          ),
          new TableRow({
            children: [
              dataCell('TOTAL', 0, { bold: true }),
              dataCell('', 0),
              dataCell('', 0),
              dataCell('', 0),
              dataCell(
                `$${data.costosVariables
                  .reduce(
                    (acc, cv) =>
                      acc +
                      (Number(cv.cantidad) || 0) *
                        (Number(cv.costoUnitario) || 0),
                    0
                  )
                  .toFixed(2)}`,
                0,
                { bold: true, align: AlignmentType.RIGHT }
              ),
            ],
          }),
        ],
      })
    )
    items.push(nota())
  } else {
    items.push(para('Información no disponible'))
  }

  // Costos fijos
  items.push(h('Costos Fijos', HeadingLevel.HEADING_3))
  items.push(
    para(
      'Los costos fijos corresponden a los gastos mensuales que el emprendimiento debe cubrir de manera recurrente, independientemente del volumen de producción.'
    )
  )
  if (data.costosFijos && data.costosFijos.length > 0) {
    items.push(caption('Tabla 3 – Costos Fijos'))
    items.push(
      new Table({
        alignment: AlignmentType.CENTER,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              headerCell('Detalle'),
              headerCell('Valor mensual (USD)'),
            ],
          }),
          ...data.costosFijos.map(
            (cf, i) =>
              new TableRow({
                children: [
                  dataCell(textOrPlaceholder(cf.detalle), i),
                  dataCell(`$${(Number(cf.valor) || 0).toFixed(2)}`, i, {
                    align: AlignmentType.RIGHT,
                  }),
                ],
              })
          ),
          new TableRow({
            children: [
              dataCell('TOTAL', 0, { bold: true }),
              dataCell(
                `$${data.costosFijos
                  .reduce((acc, cf) => acc + (Number(cf.valor) || 0), 0)
                  .toFixed(2)}`,
                0,
                { bold: true, align: AlignmentType.RIGHT }
              ),
            ],
          }),
        ],
      })
    )
    items.push(nota())
  } else {
    items.push(para('Información no disponible'))
  }

  // Inversión inicial
  items.push(h('Inversión Inicial', HeadingLevel.HEADING_3))
  items.push(
    para(
      'La inversión inicial necesaria para poner en marcha el emprendimiento se detalla a continuación.'
    )
  )
  if (data.inversionInicial && data.inversionInicial.length > 0) {
    items.push(
      caption('Tabla 4 – Detalle de equipo, maquinaria y financiamiento')
    )
    items.push(
      new Table({
        alignment: AlignmentType.CENTER,
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              headerCell('Categoría'),
              headerCell('Descripción'),
              headerCell('Costo estimado (USD)'),
            ],
          }),
          ...data.inversionInicial.map(
            (inv, i) =>
              new TableRow({
                children: [
                  dataCell(textOrPlaceholder(inv.categoria), i),
                  dataCell(textOrPlaceholder(inv.descripcion), i),
                  dataCell(`$${(Number(inv.costo) || 0).toFixed(2)}`, i, {
                    align: AlignmentType.RIGHT,
                  }),
                ],
              })
          ),
          new TableRow({
            children: [
              dataCell('TOTAL', 0, { bold: true }),
              dataCell('', 0),
              dataCell(
                `$${data.inversionInicial
                  .reduce((acc, inv) => acc + (Number(inv.costo) || 0), 0)
                  .toFixed(2)}`,
                0,
                { bold: true, align: AlignmentType.RIGHT }
              ),
            ],
          }),
        ],
      })
    )
    items.push(nota())
  } else {
    items.push(para('Información no disponible'))
  }

  // Proyección
  items.push(...createProjectionSection(data))

  return items
}

// ── Projection (inline, not separate section) ─────────────────────

function createProjectionSection(
  data: ModeloNegocioFullData
): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = []

  if (!data.proyeccion || data.proyeccion.filas.length === 0) {
    items.push(para('Proyección: Información no disponible'))
    return items
  }

  items.push(h('Proyección', HeadingLevel.HEADING_3))

  const intro =
    'A continuación se presenta la proyección financiera del emprendimiento ' +
    textOrPlaceholder(data.ficha.nombre_emprendimiento) +
    ', estimada a ' +
    String(data.proyeccion.filas.length / 4 || 5) +
    ' años, considerando la estructura de costos y las unidades estimadas de venta por trimestre.'

  items.push(para(intro))

  const tightMargins = { top: 40, bottom: 40, left: 60, right: 60 }
  const tightData = { align: AlignmentType.RIGHT, margins: tightMargins }
  const headerOpts = { fontSize: 16, margins: tightMargins }

  const table = new Table({
    alignment: AlignmentType.CENTER,
    rows: [
      new TableRow({
        children: [
          headerCell('AÑO', headerOpts),
          headerCell('TRIMESTRE', headerOpts),
          headerCell('UNIDADES VENDIDAS POR TRIMESTRE', headerOpts),
          headerCell('INGRESO', headerOpts),
          headerCell('COSTOS FIJOS', headerOpts),
          headerCell('COSTOS VARIABLES', headerOpts),
          headerCell('UTILIDAD NETA', headerOpts),
          headerCell('MARGEN DE GANANCIA', headerOpts),
          headerCell('BENEFICIO MENSUAL', headerOpts),
        ],
      }),
      ...data.proyeccion.filas.map(
        (fila, i) =>
          new TableRow({
            children: [
              dataCell(String(fila.anio), i, tightData),
              dataCell(String(fila.trimestre), i, tightData),
              dataCell(String(fila.unidades), i, tightData),
              dataCell(
                `$${(Number(fila.ingreso) || 0).toFixed(2)}`,
                i,
                tightData
              ),
              dataCell(
                `$${(Number(fila.costosFijos) || 0).toFixed(2)}`,
                i,
                tightData
              ),
              dataCell(
                `$${(Number(fila.costosVariables) || 0).toFixed(2)}`,
                i,
                tightData
              ),
              dataCell(
                `$${(Number(fila.utilidadNeta) || 0).toFixed(2)}`,
                i,
                tightData
              ),
              dataCell(
                `${(Number(fila.margen) || 0).toFixed(1)}%`,
                i,
                tightData
              ),
              dataCell(
                `$${(Number(fila.ingresoMensualPromedio) || 0).toFixed(2)}`,
                i,
                tightData
              ),
            ],
          })
      ),
    ],
  })
  items.push(table)

  items.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Tabla 5 – ${textOrPlaceholder(data.ficha.nombre_emprendimiento)}`,
          bold: true,
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  )

  items.push(nota())

  return items
}

// ── FODA table ─────────────────────────────────────────────────────

function createFodaTable(data: ModeloNegocioFullData): (Paragraph | Table)[] {
  const items: (Paragraph | Table)[] = []
  items.push(h('7. Anexos', HeadingLevel.HEADING_1))
  items.push(h('Análisis FODA', HeadingLevel.HEADING_2))

  const foda = data.foda
  if (!foda) {
    items.push(para('Información no disponible'))
    return items
  }

  items.push(
    new Table({
      alignment: AlignmentType.CENTER,
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [headerCell('Fortalezas'), headerCell('Oportunidades')],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [para(textOrPlaceholder(foda.fortalezas))],
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [para(textOrPlaceholder(foda.oportunidades))],
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
            }),
          ],
        }),
        new TableRow({
          children: [headerCell('Debilidades'), headerCell('Amenazas')],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [para(textOrPlaceholder(foda.debilidades))],
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [para(textOrPlaceholder(foda.amenazas))],
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
            }),
          ],
        }),
      ],
    })
  )
  items.push(nota())

  return items
}

// ── Main export ────────────────────────────────────────────────────

export async function generateModeloNegocioDocx(
  data: ModeloNegocioFullData
): Promise<Blob> {
  const [logoEscudo, logoEscudo2] = await Promise.all([
    loadLogo('/images/escudo.png'),
    loadLogo('/images/escudo-ibarra.png'),
  ])

  const coverContent = createCoverPage(data, logoEscudo, logoEscudo2)
  const tocContent = createTableOfContents()
  const fichaContent = createFichaPage(data)
  const introduccionContent = createIntroduccion(data)
  const antecedentesContent = [
    h('2. Antecedentes del Emprendimiento', HeadingLevel.HEADING_1),
    para(textOrPlaceholder(data.contexto?.antecedentes)),
  ]
  const justificacionContent = [
    h('3. Justificación', HeadingLevel.HEADING_1),
    para(textOrPlaceholder(data.contexto?.justificacion)),
  ]
  const objetivoContent = createObjetivo(data)
  const modeloContent = createModeloNegocioSection(data)
  const conclusionesContent = [
    h('6. Conclusiones', HeadingLevel.HEADING_1),
    para(textOrPlaceholder(data.conclusiones)),
  ]
  const anexosContent = createFodaTable(data)

  const pageProps = {
    properties: {
      page: {
        margin: {
          top: PAGE_TOP,
          bottom: PAGE_BOTTOM,
          left: PAGE_LEFT,
          right: PAGE_RIGHT,
        },
      },
    },
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { size: 22, font: 'Arial' },
        },
      },
    },
    sections: [
      { ...pageProps, children: coverContent },
      { ...pageProps, children: tocContent },
      { ...pageProps, children: fichaContent },
      { ...pageProps, children: introduccionContent },
      { ...pageProps, children: antecedentesContent },
      { ...pageProps, children: justificacionContent },
      { ...pageProps, children: objetivoContent },
      { ...pageProps, children: modeloContent },
      { ...pageProps, children: conclusionesContent },
      { ...pageProps, children: anexosContent },
    ],
  })

  return Packer.toBlob(doc)
}
