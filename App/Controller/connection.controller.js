const establishConnection = require("../../Config/establishConnection");
exports.connection = async (req, res, next) => {
  try {
    const { dialect, user, host, database, password, port, url } = req?.body;
    const connectionPayload = {
        dialect, user, host, database, password, port, url
    }
    const getConectionStatus = await establishConnection(connectionPayload);
    return
  } catch (error) {
    next(error);
  }
};
