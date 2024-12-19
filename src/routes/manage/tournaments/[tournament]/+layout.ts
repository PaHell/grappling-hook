import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = ({ params }) => {
      return { tournamentId: parseInt(params.tournament) };
};