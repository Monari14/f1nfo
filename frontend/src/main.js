import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";

import Seasons from "./pages/Seasons.vue";
import Schedule from "./pages/Schedule.vue";
import StageDetails from "./pages/StageDetails.vue";
import Competitor from "./pages/CompetitorProfile.vue";
import Team from "./pages/TeamProfile.vue";
import CompetitorFelipe from "./pages/CompetitorFelipe.vue";

const routes = [
  { path: "/", component: Seasons },
  { path: "/schedule/:id", component: Schedule, props: true },
  { path: "/gp/:id", name: "StageDetails", component: StageDetails, props: true },
  { path: "/competitor/:id", component: Competitor, props: true },
  { path: "/team/:id", component: Team, props: true },
  { path: "/competitor/felipe_monari", component: CompetitorFelipe, props: true },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
