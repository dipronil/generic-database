const mongoose = require('mongoose');
 
const schemaInfoSchema = new mongoose.Schema({
    body: {
        type: JSON,
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Project'
        // required: true,
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Organization'
        // required: true,
    },
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    databaseId :{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Database' 
    }
}, {
    timestamps: true,
});
 
const SchemaInfo = new mongoose.model('SchemaInfo', schemaInfoSchema);
module.exports = SchemaInfo;