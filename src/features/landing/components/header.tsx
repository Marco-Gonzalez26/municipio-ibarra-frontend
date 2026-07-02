import Image from 'next/image'

export const Header = () => {
  return (
    <header className="bg-background ">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-4  justify-center rounded-full ">
          <img
            src="/images/escudo.png"
            alt="Escudo"
            className="object-contain w-48"
          />
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
