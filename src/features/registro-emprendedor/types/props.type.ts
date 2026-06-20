import {
  CatalogoItem,
  CatalogoResponse,
  RangoEdadItem,
  CatalogoItemConOrden,
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

export interface TechnicalAssistanceCatalogs {
  assistanceAreas: CatalogoResponse<CatalogoItemConOrden & { activo: boolean }>
}

export interface CurrentSituationCatalogs {
  incomeLevels: CatalogoResponse<CatalogoItem>
  entrepreneurSituations: CatalogoResponse<CatalogoItem>
  entrepreneurOccupations: CatalogoResponse<CatalogoItem>
}