import type { Translation } from '../i18n-types';
import type { EnumTranslation, ModelTranslation } from '../i18n-custom-types';
import { tournaments, games, teams, players, TableNames } from '../../lib/database/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { GameResult } from '../../lib/database/enums';

const de = {
	general: {
		formats: {
			dateTimeName: 'de-DE',
			date: "yyyy-MM-DD",
		},
		search: 'Suchen',
		more: 'Mehr',
	},
	components: {
		imageCropper: {
			chooseImageFromLibrary: 'Bild aus Bibliothek wählen',
			chooseFromExisting: 'Aus bestehendem wählen',
			removeImage: 'Bild entfernen',
		},
	},
	crud: {
		create: {
			createNewModel: 'Neues {model} erstellen',
			discard: 'Verwerfen',
			createModel: '{model} erstellen',
		},
		edit: {
			editModelItem: '{model} \"{item}\" bearbeiten',
			editModel: '{model} bearbeiten',
			discard: 'Verwerfen',
			saveChanges: 'Änderungen speichern',
		},
		delete: {
			deleteModelItem: '{model} \"{item}\" löschen?',
			areYouSure: 'Möchten Sie \"{item}\" wirklich löschen?',
			lostForeverCannotBeUndone: 'Diese Aktion kann nicht rückgängig gemacht werden und das Element geht für immer verloren (Eine sehr lange Zeit).',
			deleteModel: '{model} löschen',
			keep: 'Behalten',
		}
	},
	enums: {
		GameResult: {
			label: 'Spiel Ergebnis{{se}}',
			[GameResult.NotDecided]: 'Nicht entschieden',
			[GameResult.Red]: 'Rot',
			[GameResult.Blue]: 'Blau',
		} satisfies EnumTranslation<GameResult>
	},
	models: {
		[TableNames.Tournaments]: {
			general: {
				label: 'Turnier{{e}}',
				empty: 'Keine Turniere',
				noneSelected: 'Kein Turnier ausgewählt',
			},
			img: {
				label: 'Bild',
				placeholder: 'Kein Bild',
			},
			name: {
				label: 'Name',
				placeholder: 'Großes Turnier',
			},
			dateOfMatch: {
				label: 'Spieltermin',
				placeholder: '1989-11-09',
			},
		} satisfies ModelTranslation<InferSelectModel<typeof tournaments>>,
		[TableNames.Teams]: {
			general: {
				label: 'Team{{s}}',
				empty: 'No team{{s}}',
			}
		} satisfies ModelTranslation<InferSelectModel<typeof teams>>,
		[TableNames.Games]: {
			general: {
				label: 'Spiel{{e}}',
				empty: 'Keine Spiele',
			}
		} satisfies ModelTranslation<InferSelectModel<typeof games>>,
		[TableNames.Players]: {
			general: {
				label: 'Spieler',
				empty: 'Keine Spieler',
			}
		} satisfies ModelTranslation<InferSelectModel<typeof players>>,
		[TableNames.Settings]: {
			general: {
				label: 'Einstellungen',
				empty: 'Keine Einstellungen',
			}
		} satisfies ModelTranslation<InferSelectModel<typeof players>>
	},
	routes: {
		manage: {
			tournaments: {
				play: 'Spielen',
				searchForTournament: 'Nach Turnier, Spieler or Vereinigungen suchen...',
			}
		},
		championSelect: {
			title: 'Meisterauswahl',
		},
	}
} satisfies Translation

export default de
