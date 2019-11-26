require("dotenv").config()
const withNextEnv = require("next-env")()

module.exports = withNextEnv({
    assetPrefix: process.env.PRODUCTION_PREFIX
})