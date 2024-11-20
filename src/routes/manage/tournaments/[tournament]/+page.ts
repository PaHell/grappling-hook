import { db } from "$lib/database";
import type { PageLoad } from "./$types";
import { tournaments } from "@/database/schema";
import { eq } from "drizzle-orm";

export const load: PageLoad = async ({ params, parent }) => {
      await parent();
      const tournament = await db.select().from(tournaments).where(eq(tournaments.id, parseInt(params.tournament)));
      return {
            tournamentId: params.tournament,
            tournament: tournament[0],
      };
};