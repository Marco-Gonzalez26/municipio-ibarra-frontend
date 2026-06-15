# Municipio Ibarra - Frontend

Sistema interno desarrollado para el Municipio de San Miguel de Ibarra.

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS v4
- shadcn/ui

## Flujo de trabajo

### Ramas

- `main` → producción, siempre estable
- `develop` → integración, aquí se mergean las features

### Reglas (obligatorias)

- ❌ Nunca hacer push directo a `main` o `develop`
- ✅ Crear siempre una branch desde `develop`
- ✅ Abrir un PR hacia `develop` cuando termines una tarea
- ✅ El PR debe ser aprobado por el equipo antes de mergear

### Nomenclatura de branches

- `feature/nombre-descriptivo`
- `fix/nombre-del-bug`
- `chore/nombre`

## Convenciones de commits

### Formato

`tipo: descripción corta en minúsculas`

### Tipos

- `feat` → nueva funcionalidad
- `fix` → corrección de bug
- `chore` → configuración, dependencias
- `style` → cambios de estilos
- `refactor` → refactorización de código
- `docs` → documentación

### Ejemplos

- `feat: add login form`
- `fix: fix password validation`
- `chore: configure eslint`
- `style: adjust navbar colors`
- `refactor: extract auth hook`
- `docs: update README`
