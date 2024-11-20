import { TournamentFilter } from ".";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url }) => {
      const filter = url.searchParams.get("filter");
      const parsed = Object.values(TournamentFilter).find((f) => f === filter);
      return { filter: parsed || TournamentFilter.All };
};