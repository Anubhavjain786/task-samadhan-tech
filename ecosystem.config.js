module.exports = {
  apps: [
    {
      name: 'samadhan-tech-task-control-panel',
      script: './dist/apps/control-panel/src/main.js',
      env_production: {
        APP_PORT: 5055,
      },
    },
  ],
};
