import type { EnumTranslation, ModelTranslation } from '../i18n-custom-types'
import type { BaseTranslation } from '../i18n-types'
import { tournaments, games, teams, players, TableNames } from '../../lib/database/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { GameResult } from '../../lib/database/enums';

const en = {
	general: {
		search: 'Search',
		more: 'More',
	},
	crud: {
		edit: {
			editModelItem: 'Edit {model} \"{item}\"',
			editModel: 'Edit {model}',
			discard: 'Discard',
			saveChanges: 'Save Changes',
		},
		delete: {
			deleteModelItem: 'Delete {model} \"{item}\"?',
			areYouSure: 'Are you sure you want to delete "{item}"?',
			lostForeverCannotBeUndone: 'This action cannot be undone and the item will be lost forever (a very long time).',
			deleteModel: 'Delete {model}',
			keep: 'Keep',
		}
	},
	enums: {
		GameResult: {
			label: 'Game Result{{s}}',
			[GameResult.NotDecided]: 'Not Decided',
			[GameResult.Red]: 'Red',
			[GameResult.Blue]: 'Blue',
		} satisfies EnumTranslation<GameResult>
	},
	models: {
		[TableNames.Tournaments]: {
			general: {
				label: 'Tournament{{s}}',
				none: 'No tournament{{s}}',
			}
		} satisfies ModelTranslation<InferSelectModel<typeof tournaments>>,
		[TableNames.Teams]: {
			general: {
				label: 'Team{{s}}',
				none: 'No team{{s}}',
			}
		} satisfies ModelTranslation<InferSelectModel<typeof teams>>,
		[TableNames.Games]: {
			general: {
				label: 'Game{{s}}',
				none: 'No game{{s}}',
			}
		} satisfies ModelTranslation<InferSelectModel<typeof games>>,
		[TableNames.Players]: {
			general: {
				label: 'Player{{s}}',
				none: 'No player{{s}}',
			}
		} satisfies ModelTranslation<InferSelectModel<typeof players>>,
		[TableNames.Settings]: {
			general: {
				label: 'Settings',
				none: 'No settings',
			}
		} satisfies ModelTranslation<InferSelectModel<typeof players>>
	},
	routes: {
		manage: {
			tournaments: {
				play: 'Play',
			},
		},
		championSelect: {
			title: 'Champion Select',
		},
	}
} satisfies BaseTranslation

export default en
