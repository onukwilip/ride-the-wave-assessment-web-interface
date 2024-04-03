import React, { FormEventHandler, useCallback, useRef, useState } from "react";
import css from "../styles/Form.module.scss";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { useInput, useForm } from "use-manage-form";
import { useDispatch, useSelector } from "react-redux";
import { GetGroupsReducerType, SelectorType } from "../types";
import { fetch_groups_action } from "../redux-store/get_groups.store";

const Form = () => {
  const groups_reducer = useSelector<SelectorType, GetGroupsReducerType>(
    (state) => state.get_groups
  );
  const dispatch = useDispatch();

  const {
    value: location,
    inputIsInValid: location_input_is_invalid,
    isValid: location_is_valid,
    onChange: on_location_change,
    onBlur: on_location_blur,
    reset: reset_location,
  } = useInput<string>((value) => (value ? value?.trim() !== "" : false));

  const {
    value: group_type,
    inputIsInValid: group_type_input_is_invalid,
    isValid: group_type_is_valid,
    onChange: on_group_type_change,
    onBlur: on_group_type_blur,
    reset: reset_group_type,
  } = useInput<string>((value) => (value ? value?.trim() !== "" : false));

  const {
    value: radius,
    inputIsInValid: radius_input_is_invalid,
    isValid: radius_is_valid,
    onChange: on_radius_change,
    onBlur: on_radius_blur,
    reset: reset_radius,
  } = useInput<string>((value) => (value ? !isNaN(value as any) : false));

  const {
    value: min_members,
    inputIsInValid: min_members_input_is_invalid,
    isValid: min_members_is_valid,
    onChange: on_min_members_change,
    onBlur: on_min_members_blur,
    reset: reset_min_members,
  } = useInput<string>((value) => (value ? !isNaN(value as any) : false));

  const {
    value: unit,
    inputIsInValid: unit_input_is_invalid,
    isValid: unit_is_valid,
    onChange: on_unit_change,
    onBlur: on_unit_blur,
    reset: reset_unit,
  } = useInput<"km" | "miles">({
    validateFunction: (value) =>
      value ? value === "km" || value === "miles" : false,
    defaultValue: "km",
  });

  const {
    value: visibility,
    inputIsInValid: visibility_input_is_invalid,
    isValid: visibility_is_valid,
    onChange: on_visibility_change,
    onBlur: on_visibility_blur,
    reset: reset_visibility,
  } = useInput<"private" | "public">({
    validateFunction: (value) =>
      value ? value === "private" || value === "public" : false,
    defaultValue: "private",
  });

  const {
    formIsValid,
    executeBlurHandlers,
    reset: reset_form,
  } = useForm({
    blurHandlers: [
      on_location_blur,
      on_radius_blur,
      on_unit_blur,
      on_group_type_blur,
      on_min_members_blur,
      on_visibility_blur,
    ],
    resetHandlers: [
      reset_location,
      reset_group_type,
      reset_min_members,
      reset_radius,
      () => {
        reset_unit();
        on_unit_change("km");
      },
      () => {
        reset_visibility();
        on_visibility_change("private");
      },
    ],
    validateOptions: () =>
      location_is_valid &&
      radius_is_valid &&
      unit_is_valid &&
      group_type_is_valid &&
      min_members_is_valid &&
      visibility_is_valid,
  });

  const submit_handler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!formIsValid) return executeBlurHandlers();

    console.log("VALUES", location, radius, unit);
    dispatch(
      fetch_groups_action({
        location: location as string,
        group_type: group_type as string,
        min_members: Number(min_members),
        radius: Number(radius),
        unit: unit as string,
        visibility: visibility as string,
      }) as any
    );

    reset_form();
  };

  return (
    <>
      <form className={css.form} onSubmit={submit_handler}>
        <TextField
          name="location"
          label="Location"
          placeholder="Enter preferred location..."
          variant="filled"
          className={css.input}
          value={location}
          onBlur={on_location_blur as any}
          onChange={(e) => on_location_change(e.target.value)}
          error={location_input_is_invalid}
          helperText={location_input_is_invalid && "Input must not be empty"}
        />
        <TextField
          name="group_type"
          label="Group type"
          placeholder="Enter preferred type of group, e.g, Community, Town, etc..."
          variant="filled"
          className={css.input}
          value={group_type}
          onBlur={on_group_type_blur as any}
          onChange={(e) => on_group_type_change(e.target.value)}
          error={group_type_input_is_invalid}
          helperText={group_type_input_is_invalid && "Input must not be empty"}
        />
        <TextField
          name="min_members"
          label="Minimum members"
          placeholder="Enter minimum number of members the group should have..."
          variant="filled"
          className={css.input}
          value={min_members}
          onBlur={on_min_members_blur as any}
          onChange={(e) => on_min_members_change(e.target.value)}
          error={min_members_input_is_invalid}
          helperText={min_members_input_is_invalid && "Input must not be empty"}
          type="number"
        />
        <TextField
          name="radius"
          label="Radius"
          placeholder="Enter preferred radius..."
          variant="filled"
          className={css.input}
          value={radius}
          onBlur={on_radius_blur as any}
          onChange={(e) => on_radius_change(e.target.value)}
          error={radius_input_is_invalid}
          helperText={radius_input_is_invalid && "Input must not be empty"}
          type="number"
        />
        <FormControl fullWidth>
          <InputLabel>Unit</InputLabel>
          <Select
            name="unit"
            label="Unit"
            placeholder="Enter the unit of the radius"
            variant="filled"
            className={css.input}
            value={unit}
            onBlur={on_unit_blur as any}
            onChange={(e) => on_unit_change(e.target.value)}
            error={unit_input_is_invalid}
          >
            <MenuItem value="km">km</MenuItem>
            <MenuItem value="miles">miles</MenuItem>
          </Select>

          {unit_input_is_invalid && (
            <FormHelperText error>"Input must not be empty"</FormHelperText>
          )}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Visibility</InputLabel>
          <Select
            name="group_visibility"
            label="Visibility"
            placeholder="Select if the groups should be private or public"
            variant="filled"
            className={css.input}
            value={visibility}
            onBlur={on_visibility_blur as any}
            onChange={(e) => on_visibility_change(e.target.value)}
            error={visibility_input_is_invalid}
          >
            <MenuItem value="private">private</MenuItem>
            <MenuItem value="public">public</MenuItem>
          </Select>

          {unit_input_is_invalid && (
            <FormHelperText error>"Input must not be empty"</FormHelperText>
          )}
        </FormControl>
        <div className={css.actions}>
          <Button
            disabled={groups_reducer.metadata.fetching}
            variant="outlined"
            color="primary"
            type="submit"
          >
            {groups_reducer.metadata.fetching ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
      <Snackbar
        open={groups_reducer.metadata.error.status}
        autoHideDuration={6000}
        color="error"
      >
        <Alert severity="error" variant="filled">
          {groups_reducer.metadata.error.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Form;
