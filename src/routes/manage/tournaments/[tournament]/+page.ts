import { tournamentQueries } from "@/queries/tournaments";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, parent }) => {
      const data = await parent();
      tournamentQueries(data.queryClient).prefetchById(parseInt(params.tournament));
      return {};
};