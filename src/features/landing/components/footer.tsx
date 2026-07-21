export const Footer = () => {
  return (
    <footer className="bg-foreground text-background footer-bg-image relative bottom-0 w-full">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <img
            src="/images/escudo-1.png"
            alt="Escudo"
            className="object-contain w-48"
          />
          <p className="mt-2 text-sm text-background/70">
            Sistema de Registro y Gestión de Emprendedores
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Enlaces</h3>
          <ul className="mt-2 space-y-1 text-sm text-background/70">
            <li>Inicio</li>
            <li>Registro Simple</li>
            <li>Asesoría Técnica</li>
            <li>Consultar Solicitud</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Contactos</h3>
          <ul className="mt-2 space-y-1 text-sm text-background/70">
            <li>Tlfno.: (+593) 06 3700 200</li>
            <li>E-mail: info@ibarra.gob.ec</li>
            <li>Dir.: Calle García Moreno 6-31 y Calle Simón Bolívar</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10 py-4 text-center text-xs text-background/50">
        © 2026 Todos los derechos reservados — Desarrollo Municipal
      </div>
    </footer>
  )
}
