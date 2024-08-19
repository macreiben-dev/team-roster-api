const originalEmail = "tony.stark@mail.local";
const originalUsername = "Tony Stark";

const data = {
  user: {
    active: true,
    connectorId: "e3306678-a53a-4964-9040-1c96f36dda72",
    data: {},
    email: originalEmail,
    encryptionScheme: "salted-pbkdf2-hmac-sha256",
    factor: 24000,
    id: "2b5dfc40-92f6-4e8f-82cd-a6135efb3944",
    insertInstant: 1723988454603,
    lastLoginInstant: 1724011308276,
    lastUpdateInstant: 1723988454603,
    memberships: [
      {
        data: {},
        groupId: "0d771ff9-4f67-4567-a669-7560d8563c3e",
        id: "b1dfe2bc-970e-4766-8d83-b04992068b03",
        insertInstant: 1723988574077,
      },
    ],
    passwordChangeRequired: false,
    passwordLastUpdateInstant: 1723988454611,
    preferredLanguages: [],
    registrations: [
      {
        applicationId: "99e68d6d-f0b0-4cfe-a3fd-0025b686148f",
        data: {},
        id: "56c785d5-600e-4d52-9810-08909ac767d5",
        insertInstant: 1723988486270,
        lastLoginInstant: 1724011308276,
        lastUpdateInstant: 1724012661106,
        preferredLanguages: ["en"],
        roles: ["team-roster-user"],
        timezone: "Europe/Paris",
        tokens: {},
        username: "Tony Stark",
        usernameStatus: "ACTIVE",
        verified: true,
        verifiedInstant: 1723988486270,
      },
    ],
    tenantId: "608525b2-902a-0293-d1f5-d34ad233f74a",
    twoFactor: {
      methods: [],
      recoveryCodes: [],
    },
    uniqueUsername: "Tony Stark",
    username: originalUsername,
    usernameStatus: "ACTIVE",
    verified: true,
    verifiedInstant: 1723988454603,
  },
};

export { data, originalEmail, originalUsername };
