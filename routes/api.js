'use strict';

const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {

  app
    .route('/api/issues/:project')

    .get(async (req, res) => {
      let projectName = req.params.project;
      //?open=true&assigned_to=Joe
      try {
        const project = await ProjectModel.findOne({ name: projectName });
        if (!project) {
          res.json([{ error: "Project not found" }]);
          return;
        } else {
          const issues = await IssueModel.find({
            projectId: project._id,
            ...req.query,
          });
          if (!issues) {
            res.json([{ error: "No issues found" }]);
            return;
          }
          res.json(issues);
          return;
        }
      } catch (err) {
        res.json({ error: "Could not get", _id: _id });
      }
    })

    .post(async (req, res) => {
      let projectName = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = 
        req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "Required field(s) missing" });
        return;
      }
      try {
        let projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          projectModel = new ProjectModel({ name: projectName });
          projectModel = await projectModel.save();
        }
        const issueModel = new IssueModel({
          projectId: projectModel._id,
          issue_title: issue_title || "",
          issue_text: issue_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by || "",
          assigned_to: assigned_to || "",
          open: true,
          status_text: status_text || "",
        });
        const issue = await issueModel.save();
        res.json(issue);
      } catch (err) {
        res.json({ error: "Could not post", _id: _id });
      }
    })

    .put(async (req, res) => {
      let projectName = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;
      if (!_id) {
        res.json({ error: "Missing _id" });
        return;
      }
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        res.json({ error: "No update field(s) sent", _id: _id });
        return;
      }
      try {
        const projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          throw new Error("Project not found");
        }
        let issue = await IssueModel.findByIdAndUpdate(_id, {
          ...req.body,
          updated_on: new Date(),
        });
        await issue.save();
        res.json({ result: "Successfully updated", _id: _id });
      } catch (err) {
          res.json({error: "Could not update", _id: _id });
      }
    })

    .delete(async (req, res) => {
      let projectName = req.params.project;
      const { _id } = req.body;
      if (!_id) {
        res.json({ error: "Missing _id" });
        return;
      }
      try {
        const projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          throw new Error("Project not found");
        }
        const result = await IssueModel.deleteOne({
          _id: _id,
          projectId: projectModel._id,
        });
        if (result.deletedCount === 0) {
          throw new Error("ID not found");
        }
        res.json({ result: "Successfully deleted", _id: _id });
      } catch (err) {
        res.json({ error: "Could not delete", _id: _id });
      }
    });
  };