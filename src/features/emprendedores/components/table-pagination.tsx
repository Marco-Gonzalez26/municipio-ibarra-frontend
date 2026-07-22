'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  total: number
  itemLabel?: string
}

export function TablePagination({
  currentPage,
  totalPages,
}: TablePaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="mt-2 flex justify-end rounded-xl border bg-background px-4 py-3 shadow-sm">
      {/* Mantiene la paginación sin tapar las últimas filas. */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
