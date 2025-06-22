const BundleTracker = require("webpack-bundle-tracker");
const port = 9002;

module.exports = {
  publicPath:
    process.env.NODE_ENV === "development"
      ? `http://localhost:${port}/static/airavata_custos_portal_frontend/dist/`
      : "/static/airavata_custos_portal_frontend/dist/",
  outputDir:
    "./airavata_custos_portal/apps/frontend/static/airavata_custos_portal_frontend/dist/",
  configureWebpack: {
    plugins: [
      new BundleTracker({
        filename: "webpack-stats.json",
        path:
          "./airavata_custos_portal/apps/frontend/static/airavata_custos_portal_frontend/dist/",
      }),
    ],
  },
  devServer: {
    port,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
