import type { PageLoad } from "./$types";

export const load: PageLoad = async (event) => {
      const layoutCookie = localStorage.getItem("PaneForge:layout");
      const collapsedCookie = localStorage.getItem("PaneForge:collapsed");

      let layout: number[] | undefined;
      let collapsed: boolean | undefined;

      if (layoutCookie) layout = JSON.parse(layoutCookie);

      if (collapsedCookie) collapsed = JSON.parse(collapsedCookie);

      return { layout, collapsed };
};