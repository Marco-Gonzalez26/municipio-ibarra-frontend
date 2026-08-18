import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { ReportPayload } from '@/features/reportes/types/report.type'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1f2937',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    color: '#6b7280',
  },
  meta: {
    marginTop: 12,
    fontSize: 9,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginTop: 18,
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e5e7eb',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  breakdownsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  breakdownBlock: {
    minWidth: 150,
    flexGrow: 1,
  },
  breakdownTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: '#374151',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottom: '1px solid #f3f4f6',
  },
  breakdownLabel: {
    fontSize: 9,
    color: '#374151',
  },
  breakdownValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #1f2937',
    paddingBottom: 4,
    marginBottom: 2,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 8.5,
  },
  emptyText: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 4,
  },
})

function formatFiltroFecha(value?: string) {
  if (!value) return 'Sin límite'
  return new Date(`${value}T00:00:00`).toLocaleDateString('es-EC', {
    dateStyle: 'long',
  })
}

export function ReportDocument({ payload }: { payload: ReportPayload }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{payload.title}</Text>
          <Text style={styles.description}>{payload.description}</Text>
          <Text style={styles.meta}>
            Rango de fechas: {formatFiltroFecha(payload.filters.desde)} —{' '}
            {formatFiltroFecha(payload.filters.hasta)}
          </Text>
          <Text style={styles.meta}>
            Generado el{' '}
            {payload.generatedAt.toLocaleString('es-EC', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </Text>
        </View>

        <View>
          {payload.summary.map((item) => (
            <View key={item.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>
                {item.value.toLocaleString('es-EC')}
              </Text>
            </View>
          ))}
        </View>

        {payload.breakdowns.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Desglose por categoría</Text>

            <View style={styles.breakdownsGrid}>
              {payload.breakdowns.map((breakdown) => (
                <View key={breakdown.title} style={styles.breakdownBlock}>
                  <Text style={styles.breakdownTitle}>{breakdown.title}</Text>

                  {breakdown.items.length === 0 ? (
                    <Text style={styles.emptyText}>Sin datos</Text>
                  ) : (
                    breakdown.items.map((item) => (
                      <View key={item.label} style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>{item.label}</Text>
                        <Text style={styles.breakdownValue}>
                          {item.value.toLocaleString('es-EC')}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {payload.detail && (
          <View>
            <Text style={styles.sectionTitle}>Listado detallado</Text>

            {payload.detail.rows.length === 0 ? (
              <Text style={styles.emptyText}>
                No hay registros en el rango de fechas seleccionado.
              </Text>
            ) : (
              <View>
                <View style={styles.tableHeaderRow}>
                  {payload.detail.columns.map((header) => (
                    <Text key={header} style={styles.tableHeaderCell}>
                      {header}
                    </Text>
                  ))}
                </View>

                {payload.detail.rows.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.tableRow} wrap={false}>
                    {row.map((cell, cellIndex) => (
                      <Text key={cellIndex} style={styles.tableCell}>
                        {cell || '—'}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  )
}
