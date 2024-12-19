import { redirect } from "@sveltejs/kit";
import { TournamentFilter } from ".";
import type { LayoutLoad } from "./$types";
import { tournamentQueries } from "@/queries/tournaments";

export const load: LayoutLoad = async ({ parent, url }) => {
      const data = await parent();
      const param = url.searchParams.get("filter");
      const filter = Object.values(TournamentFilter).find((f) => f === param);
      if (!filter) {
            redirect(302, `/manage/tournaments?filter=${TournamentFilter.All}`);
      }
      tournamentQueries(data.queryClient).prefetchAll();
      return { filter };
};