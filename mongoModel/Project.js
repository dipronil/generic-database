const mongoose = require('mongoose');
 
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Organization'
    },
}, {
    timestamps: true,
});
 
const Project = new mongoose.model('Project', projectSchema);
module.exports = Project;