class ConnectedUser {
  private _email: string;
  private _username: string;

  constructor(userFromApi: any) {
    if (!userFromApi) {
      throw new UserFromApiNullError();
    }
    this._email = userFromApi.user.email as string;
    this._username = userFromApi.user.username as string;
  }

  get email(): string {
    return this._email;
  }

  get userName(): string {
    return this._username;
  }

  toJson(): any {
    return {
      email: this._email,
      userName: this._username,
    };
  }
}

class UserFromApiNullError extends Error {
  constructor() {
    super("User from api is null or undefined");
  }
}
export { ConnectedUser, UserFromApiNullError };
