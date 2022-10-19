import { OAuth2Client } from 'google-auth-library';

// google login client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default client;
