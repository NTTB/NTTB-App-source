import Gdpr from './modules/gdpr/gdpr.svelte';
import Dummy from './modules/dummy/dummy.svelte';
import type { SvelteComponent } from 'svelte';
declare function $(...args);

var currentPage: SvelteComponent | undefined;

type PageType = "GDPR" | "Dummy";
function setPageComponent(pageType?: PageType, props?: object) {
  currentPage?.$destroy();
  $("#content").html('');
  switch (pageType) {
    case undefined:
    case null:
      currentPage = undefined;
      break;
    case "Dummy":
      currentPage = new Dummy({ target: document.querySelector("#content"), props: props });
      break;
    case "GDPR":
      currentPage = new Gdpr({ target: document.querySelector("#content") });
      break;
  }
}

(window as any).setPageComponent = setPageComponent;