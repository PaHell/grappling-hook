import { emit, listen, type EventCallback } from "@tauri-apps/api/event";

export type Player = {
      name: string;
}

export type Team = {
      img: string | null;
      name: string;
      score: number;
      players: Player[];
}

export type Ban = {
      champion: string;
}

export type Pick = {
      champion: string;
}

export type Summoner = {
      name: string;
}

export type Branding = {
      logo: string | undefined;
      headline: string;
      subtitle: string | undefined;
}

export type ChampionSelectData = {
      timer: number;
      currentAction: string;
      redTeam: Team;
      redBans: Ban[];
      redPicks: Pick[];
      redSummoners: [Summoner, Summoner][];
      blueTeam: Team;
      blueBans: Ban[];
      bluePicks: Pick[];
      blueSummoners: [Summoner, Summoner][];
}

export enum ChampionSelectEvent {
      Ready = 'ready',
      SetTimer = 'setTimer',
      SetCurrentAction = 'setCurrentAction',
      SetBranding = 'setBranding',
      SetTeams = 'setTeams',
      UpdateBan = 'updateBan',
      UpdatePick = 'updatePick',
      UpdateSummoners = 'updateSummoners',
}

function emitChampionSelectEvent<T>(type: ChampionSelectEvent, data: T) {
      return emit('championSelect:' + type, data);
}

function listenToChampionSelectEvent<T>(type: ChampionSelectEvent, callback: EventCallback<T>) {
      return listen<T>('championSelect:' + type, callback);
}

export const sendReady = () => emitChampionSelectEvent(ChampionSelectEvent.Ready, undefined);
export const listenReady = (callback: EventCallback<undefined>) => listenToChampionSelectEvent(ChampionSelectEvent.Ready, callback);

export const setTimer = (data: number) => emitChampionSelectEvent(ChampionSelectEvent.SetTimer, data);
export const listenTimer = (callback: EventCallback<number>) => listenToChampionSelectEvent(ChampionSelectEvent.SetTimer, callback);

export const setCurrentAction = (data: string) => emitChampionSelectEvent(ChampionSelectEvent.SetCurrentAction, data);
export const listenCurrentAction = (callback: EventCallback<string>) => listenToChampionSelectEvent(ChampionSelectEvent.SetCurrentAction, callback);

export const setBranding = (data: Branding) => emitChampionSelectEvent(ChampionSelectEvent.SetBranding, data);
export const listenBranding = (callback: EventCallback<Branding>) => listenToChampionSelectEvent(ChampionSelectEvent.SetBranding, callback);

export const setTeams = (team: 0 | 1, data: Team) => emitChampionSelectEvent(ChampionSelectEvent.SetTeams, { team, data });
export const listenTeams = (callback: EventCallback<{ team: 0 | 1, data: Team }>) => listenToChampionSelectEvent(ChampionSelectEvent.SetTeams, callback);

export const updateBan = (team: 0 | 1, player: number, ban: Ban) => emitChampionSelectEvent(ChampionSelectEvent.UpdateBan, { team, player, ban });
export const listenBan = (callback: EventCallback<{ team: 0 | 1, player: number, ban: Ban }>) => listenToChampionSelectEvent(ChampionSelectEvent.UpdateBan, callback);

export const updatePick = (team: 0 | 1, player: number, pick: Pick) => emitChampionSelectEvent(ChampionSelectEvent.UpdatePick, { team, player, pick });
export const listenPick = (callback: EventCallback<{ team: 0 | 1, player: number, pick: Pick }>) => listenToChampionSelectEvent(ChampionSelectEvent.UpdatePick, callback);

export const updateSummoners = (team: 0 | 1, player: number, summoners: [Summoner, Summoner]) => emitChampionSelectEvent(ChampionSelectEvent.UpdateSummoners, { team, player, summoners });
export const listenSummoners = (callback: EventCallback<{ team: 0 | 1, player: number, summoners: [Summoner, Summoner] }>) => listenToChampionSelectEvent(ChampionSelectEvent.UpdateSummoners, callback);