import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  ip: {type:String},
  location:{type: String},
  timestamp: { type: Date, default: Date.now }
});

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clicks: [clickSchema]
},{ timestamps: true });

const urlModel=mongoose.model("Url",urlSchema)
export default urlModel