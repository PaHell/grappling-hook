import { sqliteTable, text, integer, type AnySQLiteColumn, customType, blob } from 'drizzle-orm/sqlite-core';
import { enumType } from './types';
import { GameResult } from './enums';

export enum TableNames {
	Tournaments = 'tournaments',
	Games = 'games',
	Teams = 'teams',
	Players = 'players',
	Settings = 'settings',
}

export const tournaments = sqliteTable(TableNames.Tournaments, {
	id: integer('id').primaryKey({ autoIncrement: true }),
	img: blob('img'),
	name: text('name').notNull(),
	dateOfMatch: integer({ mode: 'timestamp' }),
});

export const games = sqliteTable(TableNames.Games, {
	id: integer('id').primaryKey({ autoIncrement: true }),
	redTeamId: integer().references((): AnySQLiteColumn => teams.id),
	blueTeamId: integer().references((): AnySQLiteColumn => teams.id),
	dateOfMatch: integer({ mode: 'timestamp' }),
	tournamentId: integer().references((): AnySQLiteColumn => tournaments.id),
	result: enumType('result', GameResult).default(GameResult.NotDecided),
});

export const teams = sqliteTable(TableNames.Teams, {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
});

export const players = sqliteTable(TableNames.Players, {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	ign: text('ign').unique(),
	teamId: integer().references((): AnySQLiteColumn => teams.id),
});

export const settings = sqliteTable(TableNames.Settings, {
	id: integer('id').primaryKey({ autoIncrement: true }),
	orgImg: blob('orgImg'),
	orgName: text('orgName'),
	locale: text('locale'),
});
