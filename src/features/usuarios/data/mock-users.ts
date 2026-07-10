import type { Usuario } from '../types/user.type'

export const mockUsers: Usuario[] = [
  {
    id: 1,
    nombres: 'Administrador',
    apellidos: 'Municipal',
    email: 'admin@ibarra.gob.ec',
    rol: 'Administrador',
    activo: true,
    fecha_registro: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 2,
    nombres: 'Técnico',
    apellidos: 'Municipal',
    email: 'tecnico@ibarra.gob.ec',
    rol: 'Técnico Municipal',
    activo: true,
    fecha_registro: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 3,
    nombres: 'Consulta',
    apellidos: 'Institucional',
    email: 'consulta@ibarra.gob.ec',
    rol: 'Consulta',
    activo: false,
    fecha_registro: '2026-07-08T00:00:00.000Z',
  },
]
