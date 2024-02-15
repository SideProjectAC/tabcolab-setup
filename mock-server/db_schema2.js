const itemSchema = new mongoose.Schema({
  id: String,
  category: { type: String, enum: ["tab", "note", "todo"] },
  title: String,
  favIcon: String,
  url: String,
  comment: String,
  todo: Boolean,
  done: Boolean,
  createdAt: { type: Date, default: Date.now },
  position: Number,
  group_id: { type: String, ref: "Group" },
});

const groupSchema = new mongoose.Schema({
  id: String,
  title: String,
  icon: String,
  items: [itemSchema],
  createdAt: { type: Date, default: Date.now },
  share_group_url: String,
  position: Number,
});
