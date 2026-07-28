import type { Usuario } from '../types/user.type'

export const mockUsers: Usuario[] = [
  {
    id: 1,
    nombres: 'Administrador',
    apellidos: 'Municipal',
    correo: 'admin@ibarra.gob.ec',
  
    activo: true,
    fecha_registro: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 2,
    nombres: 'Técnico',
    apellidos: 'Municipal',
    correo: 'tecnico@ibarra.gob.ec',

    activo: true,
    fecha_registro: '2026-07-08T00:00:00.000Z',
  },
  {
    id: 3,
    nombres: 'Consulta',
    apellidos: 'Institucional',
    correo: 'consulta@ibarra.gob.ec',
    rol: 'Consulta',
    activo: false,
    fecha_registro: '2026-07-08T00:00:00.000Z',
  },
]
