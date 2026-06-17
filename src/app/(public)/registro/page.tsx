import { Building2 } from 'lucide-react'
import { RegisterWizard } from '@/features/registro-emprendedor/components/register-wizard-form'
import { catalogService } from '@/features/registro-emprendedor/services/catalog.service'

export default async function Page() {
  const [
    maritalStatus,
    genders,
    occupations,
    ageRanges,
    ethnicities,
    educationLevels,
    disabilityTypes,
  ] = await Promise.all([
    catalogService.getMaritalStatus(),
    catalogService.getGender(),
    catalogService.getOccupation(),
    catalogService.getAgeRange(),
    catalogService.getEthnicity(),
    catalogService.getEducationLevel(),
    catalogService.getDisabilityType(),
  ])
  
  return (
    <div className="bg-muted/30 min-h-screen py-10">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg">
            <Building2 className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Registro de Emprendedor
            </h1>
            <p className="text-sm text-muted-foreground">
              Completa el formulario para registrar tu emprendimiento
            </p>
          </div>
        </div>

        <RegisterWizard
          personalDataCatalogs={{
            maritalStatus,
            genders,
            occupations,
            ageRanges,
            ethnicities,
            educationLevels,
            disabilityTypes,
          }}
        />
      </div>
    </div>
  )
}
