const groupSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  icon: String,
  items: [
    {
      id: String,
      category: { type: String, enum: ["tab", "note", "todo"] },
      title: String,
      favIcon: String,
      url: String,
      comment: String,
      done: Boolean,
      createdAt: { type: Date, default: Date.now },
      group_id: { type: String, ref: "Group" },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  share_group_url: String,
  workspace_id: { type: String, ref: "Workspace" },
  user_id: { type: String, ref: "User" },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
