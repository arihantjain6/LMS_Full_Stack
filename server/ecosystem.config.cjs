module.exports = {
  apps: [
    {
      name: "lms-backend",
      cwd: __dirname,
      script: "src/server.ts",
      interpreter: "bun",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      kill_timeout: 10000,
      listen_timeout: 10000,
      time: true,
      merge_logs: true,
      env: {
        NODE_ENV: "development",
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
    ...(process.argv.includes("--ngrok") || process.env.npm_config_ngrok || process.env.NGROK === "true"
      ? [
          {
            name: "ngrok",
            script: "ngrok",
            args: "http --domain=senorita-iron-tarmac.ngrok-free.dev 4000",
            interpreter: "none",
            autorestart: true,
          },
        ]
      : []),
  ],
};
