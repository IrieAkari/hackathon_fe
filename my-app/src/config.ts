const isVercel = process.env.VERCEL === '1';

export const API_BASE_URL = isVercel
    ? 'https://hackathon-be-509846548823.us-central1.run.app'
    : 'http://localhost:8000';