'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, Printer, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { generateModeloNegocioDocx } from '../lib/generate-modelo-negocio-docx'
import { getModeloNegocioFullDataAction } from '../actions/get-modelo-negocio-full-data.action'
import type { ModeloNegocioFullData } from '@/types/modelo-negocio-full.type'

interface ExportModeloNegocioButtonProps {
  data?: ModeloNegocioFullData
  modeloId?: number
  disabled?: boolean
}

export function ExportModeloNegocioButton({
  data: propData,
  modeloId,
  disabled = false,
}: ExportModeloNegocioButtonProps) {
  const [isDocxGenerating, setIsDocxGenerating] = useState(false)
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)

  async function resolveData(): Promise<ModeloNegocioFullData | null> {
    if (propData) return propData
    if (!modeloId) return null
    try {
      return await getModeloNegocioFullDataAction(modeloId)
    } catch (error) {
      console.error('Error fetching modelo data:', error)
      toast.error('Error al cargar los datos del modelo')
      return null
    }
  }

  async function handleDownloadDocx() {
    setIsDocxGenerating(true)
    try {
      const resolved = await resolveData()
      if (!resolved) {
        toast.error('No se pudieron cargar los datos')
        return
      }
      const blob = await generateModeloNegocioDocx(resolved)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ModeloNegocio_${resolved.ficha.n_tramite || 'sin-tramite'}_${resolved.ficha.nombre_emprendimiento || 'modelo-negocio'}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('DOCX descargado correctamente')
    } catch (error) {
      console.error('Error generating DOCX:', error)
      toast.error('Error al generar el documento')
    } finally {
      setIsDocxGenerating(false)
    }
  }

  async function handleExportPdf() {
    setIsPdfGenerating(true)
    try {
      const resolved = await resolveData()
      if (!resolved) {
        toast.error('No se pudieron cargar los datos')
        return
      }
      const blob = await generateModeloNegocioDocx(resolved)
      const fileName = `ModeloNegocio_${resolved.ficha.n_tramite || 'sin-tramite'}_${resolved.ficha.nombre_emprendimiento || 'modelo-negocio'}`
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        toast.error('No se pudo abrir la ventana de impresión')
        setIsPdfGenerating(false)
        return
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${fileName}</title>
            <style>
              body { margin: 0; padding: 0; }
              @page { size: A4; margin: 0; }
              @media print { body { margin: 0; } }
              .docx-wrapper > section.docx { page-break-after: always; break-after: page; }
              .docx-wrapper > section.docx:last-child { page-break-after: auto; break-after: auto; }
            </style>
          </head>
          <body>
            <div id="docx-container"></div>
          </body>
        </html>
      `)
      printWindow.document.close()

      setTimeout(() => {
        import('docx-preview').then(({ renderAsync }) => {
          const container =
            printWindow.document.getElementById('docx-container')
          if (container) {
            renderAsync(blob, container, undefined, {
              breakPages: true,
              inWrapper: true,
              hideWrapperOnPrint: true,
            }).then(() => {
              setTimeout(() => {
                printWindow.print()
              }, 500)
            })
          }
          setIsPdfGenerating(false)
        })
      }, 300)
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Error al exportar a PDF')
      setIsPdfGenerating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownloadDocx}
        disabled={disabled || isDocxGenerating}
      >
        {isDocxGenerating ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <FileDown className="mr-2 size-4" />
        )}
        Descargar DOCX
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={handleExportPdf}
        disabled={disabled || isPdfGenerating}
      >
        {isPdfGenerating ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Printer className="mr-2 size-4" />
        )}
        Exportar PDF
      </Button>
    </div>
  )
}
