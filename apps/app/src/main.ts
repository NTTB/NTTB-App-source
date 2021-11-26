import App from './App.svelte';
import Gdpr from './modules/gdpr/gdpr.svelte';
import Dummy from './modules/dummy/dummy.svelte';

document.querySelectorAll("[data-component=app]").forEach(target => {
  new App({
    target,
    props: { name: 'world' }
  })
});

document.querySelectorAll("[data-component=gdpr]").forEach(target => {
  new Gdpr({
    target,
    props: {}
  });
});

document.querySelectorAll("[data-component=dummy]").forEach(target => {
  new Dummy({
    target,
    props: {}
  });
});