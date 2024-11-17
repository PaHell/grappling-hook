import { sqliteTable, text, integer, type AnySQLiteColumn, customType } from 'drizzle-orm/sqlite-core';
import { enumType } from './types';
import { GameResult } from './enums';

export enum TableNames {
	Tournaments = 'tournaments',
	Games = 'games',
	Teams = 'teams',
	Players = 'players',
}

export const tournaments = sqliteTable(TableNames.Tournaments, {
	id: integer('id').primaryKey({ autoIncrement: true }),
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
