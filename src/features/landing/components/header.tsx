export const Header = () => {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-4 size-12 justify-center rounded-full bg-primary text-primary-foreground">
          <span className="text-xl font-bold">GAD</span>
        </div>
        <p className="text-sm font-bold leading-tight text-foreground">
          Sistema de Registro y Gestion de Emprendedores
        </p>
        <p className="text-xs text-muted-foreground">
          Municipalidad del Cantón Ibarra
        </p>
      </div>
    </header>
  )
}
