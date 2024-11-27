import { migrate } from "@/database/migrate";
import type { LayoutLoad } from "./$types";
import { db } from "@/database";
import { settings as _settings } from "@/database/schema";
import { eq, type InferSelectModel } from "drizzle-orm";

export const load: LayoutLoad = async (event) => {
      try {
            await migrate();
            let settings = await db.query.settings.findFirst();
            if (settings) {
                  settings = (await db
                        .insert(_settings)
                        .values({
                              id: 0,
                              orgImg: null,
                              orgName: "E-Corp",
                              locale: "en",
                        } satisfies InferSelectModel<typeof _settings>)
                        .returning())[0];
            }
      } catch (error) {
            console.error(error);
      }
      const layoutCookie = localStorage.getItem("PaneForge:layout");
      const collapsedCookie = localStorage.getItem("PaneForge:collapsed");

      let layout: number[] | undefined;
      let collapsed: boolean | undefined;

      if (layoutCookie) layout = JSON.parse(layoutCookie);

      if (collapsedCookie) collapsed = JSON.parse(collapsedCookie);

      return { layout, collapsed };
};