import { client } from "@datadog/datadog-api-client";
import dotenv from "dotenv";
dotenv.config();

const configurationOpts = {
  authMethods: {
    appKeyAuth: process.env.DD_APP_KEY,
  },
};

export const getDatadogClientConfiguration = () => {
  return client.createConfiguration(configurationOpts);
};
