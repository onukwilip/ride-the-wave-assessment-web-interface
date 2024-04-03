import React, { FC } from "react";
import css from "../styles/Groups.module.scss";
import { useSelector } from "react-redux";
import { GetGroupsReducerType, SelectorType } from "../types";
import placeholder_img from "../assets/placeholder.jpg";

const Group: FC<{
  group: {
    name: string;
    members: string;
    visibility: "private" | "public";
    image: string;
  };
}> = ({ group: { name, members, visibility, image } }) => {
  return (
    <>
      <div className={css.each_group}>
        <div className={css.img_container}>
          <img src={image || placeholder_img} alt={name} />
        </div>
        <div className={css.content}>
          <span>{name}</span>
          <span>{members} members</span>
          <span>{visibility}</span>
        </div>
      </div>
    </>
  );
};

const Place: FC<{
  place: {
    name: string;
    vicinity: string;
    icon: string;
  };
}> = ({ place: { name, vicinity, icon } }) => {
  return (
    <>
      <div className={css.each_place}>
        <div className={css.img_container}>
          <img src={icon || placeholder_img} alt={name} />
        </div>
        <div className={css.content}>
          <span>{name}</span>
          <span>{vicinity}</span>
        </div>
      </div>
    </>
  );
};

const Groups = () => {
  const groups_reducer = useSelector<SelectorType, GetGroupsReducerType>(
    (state) => state.get_groups
  );

  return (
    <div className={css.groups_component}>
      {groups_reducer.data?.groups?.length < 1 &&
      groups_reducer.data?.places?.length < 1 ? (
        "No groups to display..."
      ) : (
        <>
          <div className={css.container}>
            <div className={css.groups_container}>
              <h3>Groups within specified location</h3>
              {groups_reducer.data.groups.length > 0 ? (
                groups_reducer.data.groups.map((each_group) => (
                  <>
                    <Group group={each_group as any} />
                  </>
                ))
              ) : (
                <>No groups to display</>
              )}
            </div>
            <div className={css.places_container}>
              <h3>Places within specified location</h3>
              {groups_reducer.data.places.length > 0 ? (
                groups_reducer.data.places.map((each_place) => (
                  <>
                    <Place place={each_place as any} />
                  </>
                ))
              ) : (
                <>No places to display</>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Groups;
