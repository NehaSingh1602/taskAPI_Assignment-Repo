const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    taskTitle: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
    // taskId: {
    //   type: Schema.Types.ObjectId,
    //    ref: 'User',
    //    required: true
    //  }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
