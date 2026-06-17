import {
  CatalogoItem,
  CatalogoResponse,
  RangoEdadItem,
} from '@/types/catalog.type'

export interface PersonalDataCatalogs {
  maritalStatus: CatalogoResponse<CatalogoItem>
  genders: CatalogoResponse<CatalogoItem>
  occupations: CatalogoResponse<CatalogoItem>
  ageRanges: CatalogoResponse<RangoEdadItem>
  ethnicities: CatalogoResponse<CatalogoItem>
  educationLevels: CatalogoResponse<CatalogoItem>
  disabilityTypes: CatalogoResponse<CatalogoItem>
}
