import { client } from "@datadog/datadog-api-client";
import { ConfigurationParameters } from "@datadog/datadog-api-client/dist/packages/datadog-api-client-common/configuration";
import dotenv from "dotenv";
dotenv.config();

const configurationOptions = {
  authMethods: {
    appKeyAuth: process.env.DD_APP_KEY as string,
    apiKeyAuth: process.env.DD_API_KEY as string,
  },
};

export const getDatadogClientConfiguration = () => {
  const configurations = client.createConfiguration(configurationOptions);
  configurations.setServerVariables({
    site: process.env.DD_SITE as string,
  });
  return configurations;
};
