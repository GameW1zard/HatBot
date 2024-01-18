import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { EventSubWsListener } from '@twurple/eventsub-ws';
// client id and access token from the USER AUTHENTICATION not the bot authentication
const clientId = process.env.WIZ_USER_ID;
const accessToken = process.env.WIZ_USER_TOKEN;

const authProvider = new StaticAuthProvider(clientId, accessToken);
const apiClient = new ApiClient({ authProvider });


const listener = new EventSubWsListener({ apiClient });


export { listener as Wizlistener}