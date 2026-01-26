module.exports = {
  apps: [{
    name: 'aqtboost',
    script: 'npm',
    args: 'start',
    cwd: '/home/aqtboost/aqtboost', // Changer selon votre chemin
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    },
    error_file: '/home/aqtboost/logs/err.log',
    out_file: '/home/aqtboost/logs/out.log',
    log_file: '/home/aqtboost/logs/combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
  }]
};
