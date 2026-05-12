export type Language = "ru" | "kz";

export type LocalizedString = Record<Language, string>;

export function pickLocalized<T extends string | string[]>(
  value: Record<Language, T>,
  language: Language,
) {
  return value[language];
}
