type PropertyTranslation = { label: string; placeholder?: string; };
type EnumDescription = { label: string; };
type ModelDescription = { general: { label: string; none: string; } };

export type ModelTranslation<T> = Partial<Record<keyof T, PropertyTranslation>> & ModelDescription;
export type EnumTranslation<T extends string | number> = Record<T, string> & EnumDescription;