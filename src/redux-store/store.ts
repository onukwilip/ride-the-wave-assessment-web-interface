import { configureStore } from "@reduxjs/toolkit";
import get_groups_slice from "./get_groups.store";

const store = configureStore({
  reducer: {
    get_groups: get_groups_slice.reducer,
  },
});

export default store;
// export const get_groups_actions = get_groups_slice.actions;
