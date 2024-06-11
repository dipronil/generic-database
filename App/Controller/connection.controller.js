const {establishConnection,establishConnectionWithUrl} = require("../../Config/establishConnection");
exports.connection = async (req, res, next) => {
  try {
    let getConectionStatus;
    if(typeof req.body.configration === "string"){
        const url = req?.body?.configration
        getConectionStatus = await establishConnectionWithUrl(url)
    } else {
        const { dialect, user, host, database, password, port } = req?.body?.configration;
        const connectionPayload = {
            dialect, user, host, database, password, port
        }
        
        getConectionStatus = await establishConnection(connectionPayload);
        return res.status(200).json({
            message: getConectionStatus.message
        })
    }
  } catch (error) {
    next(error);
  }
};
