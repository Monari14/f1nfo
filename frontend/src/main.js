import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";

import Seasons from "./pages/Seasons.vue";
import SeasonDetails from "./pages/SeasonDetails.vue";
import Schedule from "./pages/Schedule.vue";
import TeamProfile from "./pages/TeamProfile.vue";
import StageSummary from "./pages/StageSummary.vue";
import Competitor from "./pages/Competitor.vue";

const routes = [
  { path: "/", component: Seasons },
  { path: "/season/:id", component: SeasonDetails, props: true },
  { path: "/schedule", component: Schedule },
  { path: "/teams", component: TeamProfile },
  { path: "/stages", component: StageSummary },
  { path: "/competitors", component: Competitor },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
