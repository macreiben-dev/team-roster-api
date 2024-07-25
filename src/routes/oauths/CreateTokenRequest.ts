import { IEnvironmentConfiguration } from "../../repositories/IEnvironmentConfiguration";

const createTokenRequest = (
  config: IEnvironmentConfiguration,
  code: string
) => {
  const data = {
    client_id: config.ClientId,
    client_secret: config.ClientSecret,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: config.RedirectUri,
  };

  return data;
};

export default createTokenRequest;
