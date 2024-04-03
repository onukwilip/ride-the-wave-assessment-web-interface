import axios from "axios";

export class GetGroupsErrorClass {
  constructor(public status: boolean, public msg: string | undefined) {}
}

export const webserver_instance = axios.create({
  baseURL: process.env.REACT_APP_API_DOMAIN,
});
