const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Định nghĩa schema cho bình luận
const commentSchema = new Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers", // Sử dụng đúng tên bảng 'customers'
      required: true,
    },
    court_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courts", // Sử dụng đúng tên bảng 'courts'
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // MongoDB sẽ tự động cập nhật thời gian cho created_at và updated_at
  }
);

// Tạo model từ schema
const Comment = mongoose.model("comments", commentSchema); // Giữ tên model là "comments"

module.exports = Comment;
