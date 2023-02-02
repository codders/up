const dev = "/app";
const prod = "https://europe-west1-up-now-a6da8.cloudfunctions.net/app";

export const API_BASE_URL = process.env.NODE_ENV === 'development' ? dev : prod;