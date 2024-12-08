import { redirect } from "@sveltejs/kit";
import { TournamentFilter } from ".";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url }) => {
      const param = url.searchParams.get("filter");
      const filter = Object.values(TournamentFilter).find((f) => f === param);
      if (!filter) {
            redirect(302, `/manage/tournaments?filter=${TournamentFilter.All}`);
      }
      return { filter };
};