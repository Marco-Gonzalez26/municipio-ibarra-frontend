import {
  CatalogoItem,
  CatalogoResponse,
  RangoEdadItem,
  CatalogoItemConOrden,
  TemaAsistenciaItem,
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
  themeAssistanceAreas: CatalogoResponse<TemaAsistenciaItem>
}

export interface CurrentSituationCatalogs {
  incomeLevels: CatalogoResponse<CatalogoItem>
  entrepreneurSituations: CatalogoResponse<CatalogoItem>
  entrepreneurOccupations: CatalogoResponse<CatalogoItem>
}

export interface IntentionsCatalogs {
  interestsSectors: CatalogoResponse<CatalogoItem>
}

export interface EnterpriseCatalogs {
  enterpriseTypes: CatalogoResponse<CatalogoItem>
  enterpriseSectors: CatalogoResponse<CatalogoItem>
  enterpriseInfrastructures: CatalogoResponse<CatalogoItem>
  assistanceAreas: CatalogoResponse<CatalogoItem>
  themeAssistanceAreas: CatalogoResponse<CatalogoItem>
}
