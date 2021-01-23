module.exports = {
    apps: [{
        name: "Reminder App", script: "./dist/main.js", watch: true, env: { "NODE_ENV": "prod" }
    }
    ]
}