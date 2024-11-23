import { migrate } from "@/database/migrate";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async (event) => {
      try {
            await migrate();
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