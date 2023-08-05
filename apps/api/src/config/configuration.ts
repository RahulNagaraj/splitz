export default () => ({
    port: parseInt(process.env.API_PORT, 10) || 3001,
    databaseUrl: process.env.DATABASE_URL || "",
});
