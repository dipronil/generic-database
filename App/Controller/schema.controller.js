const Project = require("../../mongoModel/Project");
const Organization = require("../../mongoModel/Organization");

exports.organizationCreate = async (req,res,next)=>{
    try {
        const  name = req?.body?.name;
        const organization = new Organization({
            name:name
        });
        await organization.save();
        return res.status(200).json({ message: 'Organization created successfylly.'});
    } catch (error) {
        next(error)
    }
}

exports.projectCreate = async (req,res,next)=>{
    try {
        const  name = req?.body?.name;
        const organizationId = req?.body?.organizationId;
        const project = new Project({
            name:name,
            organizationId: organizationId
        });
        await project.save();
        return res.status(200).json({ message: 'Project created successfylly.'});
    } catch (error) {
        next(error)
    }
}

