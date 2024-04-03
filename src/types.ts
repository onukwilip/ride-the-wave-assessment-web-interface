export type GetGroupsReducerType = {
  data: {
    places: (Record<any, any> | null)[];
    groups: (Record<any, any> | null)[];
  };
  metadata: {
    fetching: boolean;
    error: { status: boolean; msg: string | undefined };
  };
};

export type SelectorType = {
  get_groups: GetGroupsReducerType;
};
