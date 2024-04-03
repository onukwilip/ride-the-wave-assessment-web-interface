import { Action, Dispatch, createSlice } from "@reduxjs/toolkit";
import { GetGroupsErrorClass, webserver_instance } from "../utils";
import { GetGroupsReducerType } from "../types";

const initialState: GetGroupsReducerType = {
  data: { places: [], groups: [] },
  metadata: {
    fetching: false,
    error: { status: false, msg: undefined },
  },
};

const get_groups_slice = createSlice({
  name: "get_groups",
  initialState: initialState,
  reducers: {
    update_groups: (store, { payload }) => {
      if (payload?.places?.length > 0 || payload?.groups?.length > 0)
        store.data = { places: payload.places, groups: payload.groups };
    },
    toogleFetching: (store, { payload }: { payload: boolean }) => {
      store.metadata.fetching = payload;
    },
    toogleError: (
      store,
      { payload }: { payload: { status: boolean; msg: string | undefined } }
    ) => {
      store.metadata.error = payload;
    },
  },
});

export default get_groups_slice;
export const get_groups_actions = get_groups_slice.actions;

/**
 * The function/action responsible for getting the FB groups from the web server
 * @param data The object which should be passed to the function with properties: location, radius, unit, and timeout
 * @returns void
 */
export const fetch_groups_action = ({
  location,
  radius,
  unit,
  group_type,
  min_members,
  visibility,
  timeout,
}: {
  location: string;
  radius: number;
  unit: string;
  group_type: string;
  min_members: number;
  visibility: string;
  timeout?: number;
}) => {
  return async (dispatch: Dispatch<Action>) => {
    // * Set the fetching state to true and the error state to false
    dispatch(get_groups_actions.toogleFetching(true));
    dispatch(
      get_groups_actions.toogleError({
        ...new GetGroupsErrorClass(false, undefined),
      })
    );

    /**
     * Manages fetching and error states when an error is received from the webserver
     * @param e The error object
     */
    const manage_error = (e: any) => {
      // * Set the fetching state to false and the error state to true
      dispatch(get_groups_actions.toogleFetching(false));
      dispatch(
        get_groups_actions.toogleError({
          ...new GetGroupsErrorClass(
            true,
            e?.response?.data?.message || e?.message
          ),
        })
      );

      // * Set the error state to false after a couple of seconds
      setTimeout(() => {
        dispatch(
          get_groups_actions.toogleError({
            ...new GetGroupsErrorClass(false, undefined),
          })
        );
      }, (timeout && timeout * 1000) || 6000);
    };

    // * Make HTTP request to retrieve fb groups from the webserver
    const get_groups_response = await webserver_instance
      .get(
        `v1/groups?location=${location}&radius=${radius}&unit=${unit}&group_type=${group_type}&min_members=${min_members}&visibility=${visibility}`
      )
      .catch(manage_error);

    // * If the response status is successfull
    if (get_groups_response && get_groups_response.status === 200) {
      // * Set the fetching and error state to false
      dispatch(get_groups_actions.toogleFetching(false));
      dispatch(
        get_groups_actions.toogleError({
          ...new GetGroupsErrorClass(false, undefined),
        })
      );
      // * Update the get_groups reducer value with the response data
      dispatch(get_groups_actions.update_groups(get_groups_response.data));
    } else {
      // * Call the manage_error function
      get_groups_response && manage_error(get_groups_response.data?.message);
    }
  };
};
