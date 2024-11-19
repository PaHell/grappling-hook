// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'de'
	| 'en'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	general: {
		/**
		 * S​e​a​r​c​h
		 */
		search: string
	}
	enums: {
		GameResult: {
			/**
			 * N​o​t​ ​D​e​c​i​d​e​d
			 */
			'0': string
			/**
			 * R​e​d
			 */
			'1': string
			/**
			 * B​l​u​e
			 */
			'2': string
			/**
			 * G​a​m​e​ ​R​e​s​u​l​t​{​{​s​}​}
			 */
			label: string
		}
	}
	models: {
		tournaments: {
			general: {
				/**
				 * T​o​u​r​n​a​m​e​n​t​{​{​s​}​}
				 */
				label: string
				/**
				 * N​o​ ​t​o​u​r​n​a​m​e​n​t​{​{​s​}​}
				 */
				none: string
			}
		}
		teams: {
			general: {
				/**
				 * T​e​a​m​{​{​s​}​}
				 */
				label: string
				/**
				 * N​o​ ​t​e​a​m​{​{​s​}​}
				 */
				none: string
			}
		}
		games: {
			general: {
				/**
				 * G​a​m​e​{​{​s​}​}
				 */
				label: string
				/**
				 * N​o​ ​g​a​m​e​{​{​s​}​}
				 */
				none: string
			}
		}
		players: {
			general: {
				/**
				 * P​l​a​y​e​r​{​{​s​}​}
				 */
				label: string
				/**
				 * N​o​ ​p​l​a​y​e​r​{​{​s​}​}
				 */
				none: string
			}
		}
		settings: {
			general: {
				/**
				 * S​e​t​t​i​n​g​s
				 */
				label: string
				/**
				 * N​o​ ​s​e​t​t​i​n​g​s
				 */
				none: string
			}
		}
	}
}

export type TranslationFunctions = {
	general: {
		/**
		 * Search
		 */
		search: () => LocalizedString
	}
	enums: {
		GameResult: {
			/**
			 * Not Decided
			 */
			'0': () => LocalizedString
			/**
			 * Red
			 */
			'1': () => LocalizedString
			/**
			 * Blue
			 */
			'2': () => LocalizedString
			/**
			 * Game Result{{s}}
			 */
			label: (arg0: number | string | boolean) => LocalizedString
		}
	}
	models: {
		tournaments: {
			general: {
				/**
				 * Tournament{{s}}
				 */
				label: (arg0: number | string | boolean) => LocalizedString
				/**
				 * No tournament{{s}}
				 */
				none: (arg0: number | string | boolean) => LocalizedString
			}
		}
		teams: {
			general: {
				/**
				 * Team{{s}}
				 */
				label: (arg0: number | string | boolean) => LocalizedString
				/**
				 * No team{{s}}
				 */
				none: (arg0: number | string | boolean) => LocalizedString
			}
		}
		games: {
			general: {
				/**
				 * Game{{s}}
				 */
				label: (arg0: number | string | boolean) => LocalizedString
				/**
				 * No game{{s}}
				 */
				none: (arg0: number | string | boolean) => LocalizedString
			}
		}
		players: {
			general: {
				/**
				 * Player{{s}}
				 */
				label: (arg0: number | string | boolean) => LocalizedString
				/**
				 * No player{{s}}
				 */
				none: (arg0: number | string | boolean) => LocalizedString
			}
		}
		settings: {
			general: {
				/**
				 * Settings
				 */
				label: () => LocalizedString
				/**
				 * No settings
				 */
				none: () => LocalizedString
			}
		}
	}
}

export type Formatters = {}
