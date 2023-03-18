import { model, Document, Schema } from "mongoose"

export default model<
  Document<any> & {
    _id: string;
    users: string[]
  }>(
    "top",
    new Schema({
      _id: {
        type: String,
        required: true,
      },
      users: {
        type: [String],
        default: null,
      },
    })
  )

// 1019920993814315049