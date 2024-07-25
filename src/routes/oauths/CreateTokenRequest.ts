import { IAuthConfiguration } from "../../repositories/IAuthConfiguration";

const createTokenRequest = (config: IAuthConfiguration, code: string) => {
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
