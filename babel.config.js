module.exports = {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "@babel/preset-typescript"
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@lib": "./src/lib",
            "@generated": "./generated",
            "@commands": "./src/commands",
            "@dao": "./src/dao",
            "@test": "./src/test",
            "@config": "./src/config.ts"
          }
        }
      ]
    ]
  };
  