import { createMutation, createQuery, type QueryClient } from "@tanstack/svelte-query";
import { eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { tournaments as _tournaments } from "../database/schema";
import { db } from "@/database";

const queryKey = 'tournaments';
type Tournament = InferSelectModel<typeof _tournaments>;
type TournamentInsert = InferInsertModel<typeof _tournaments>;

const functions = {
      getAll: () => db.select().from(_tournaments).all(),
      getById: async (tournamentId: Tournament["id"]) => (await db.select().from(_tournaments).where(eq(_tournaments.id, tournamentId)))[0]
}

export const tournamentQueries = (queryClient: QueryClient) => ({
      getAll: () => createQuery({
            queryKey: [queryKey],
            queryFn: () => functions.getAll()
      }),
      prefetchAll: () => queryClient.prefetchQuery({
            queryKey: [queryKey],
            queryFn: () => functions.getAll()
      }),
      getById: (tournamentId: Tournament["id"]) => createQuery({
            queryKey: [queryKey, tournamentId],
            queryFn: ({ queryKey }) => functions.getById(queryKey[1])
      }),
      prefetchById: (tournamentId: Tournament["id"]) => queryClient.prefetchQuery({
            queryKey: [queryKey, tournamentId],
            queryFn: ({ queryKey }) => functions.getById(queryKey[1])
      }),
});

export const tournamentMutations = (queryClient: QueryClient) => ({
      // Create
      useCreate: createMutation<Tournament, Error, TournamentInsert>({
            mutationFn: async (data) => (await db
                  .insert(_tournaments)
                  .values(data)
                  .returning())[0],
            onSuccess: (data) => {
                  queryClient.setQueryData<Tournament[]>([queryKey], curr => {
                        return curr ? [...curr, data] : [data];
                  });
                  queryClient.setQueryData<Tournament>([queryKey, data.id], data);
            }
      }),
      // Update
      useUpdate: createMutation<Tournament, Error, { tournamentId: Tournament["id"], data: TournamentInsert }>({
            mutationFn: async ({ tournamentId, data }) => (await db
                  .update(_tournaments)
                  .set(data)
                  .where(eq(_tournaments.id, tournamentId))
                  .returning())[0],
            onSuccess: (data) => {
                  queryClient.setQueryData<Tournament[]>([queryKey], curr => {
                        return curr?.map((item) => item.id === data.id ? data : item);
                  });
                  queryClient.setQueryData<Tournament>([queryKey, data.id], data);
            }
      }),
      // Delete
      useDelete: createMutation<Tournament["id"], Error, Tournament["id"]>({
            mutationFn: async (tournamentId) => {
                  await db.delete(_tournaments).where(eq(_tournaments.id, tournamentId));
                  return tournamentId;
            },
            onSuccess: (data) => {
                  queryClient.setQueryData<Tournament[]>([queryKey], curr => curr?.filter((item) => item.id !== data));
                  queryClient.setQueryData<Tournament>([queryKey, data], undefined);
            }
      })
});