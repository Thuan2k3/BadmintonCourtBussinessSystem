import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Card, Form, Typography, List } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;

const Comment = ({ courtId, customer }) => {
  const [comments, setComments] = useState([]); // Đảm bảo comments là một mảng rỗng ban đầu
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  // Lấy danh sách bình luận từ server
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/user/comment/${courtId}`
      );
      if (Array.isArray(response.data)) {
        setComments(response.data);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [courtId]);

  // Thêm bình luận mới
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/comment",
        {
          customer_id: customer._id,
          court_id: courtId,
          content: newComment,
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
    }
  };

  // Cập nhật bình luận
  const handleUpdateComment = async (commentId) => {
    if (!editedContent.trim()) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/user/comment/${commentId}`,
        {
          content: editedContent,
          customer_id: customer._id,
        }
      );
      const updatedComments = comments.map((comment) =>
        comment._id === commentId ? response.data : comment
      );
      setComments(updatedComments);
      setEditingCommentId(null);
      setEditedContent("");
      fetchComments();
    } catch (error) {
      console.error("Lỗi khi cập nhật bình luận:", error);
    }
  };

  // Xóa bình luận
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/user/comment/${commentId}`,
        {
          headers: {
            customer_id: customer._id,
          },
        }
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
      fetchComments();
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };

  return (
    <div className="container mt-4">
      <Title level={3}>Bình luận</Title>

      {/* Hiển thị danh sách bình luận */}
      {comments.length === 0 ? (
        <Text>Chưa có bình luận nào.</Text>
      ) : (
        <List
          itemLayout="vertical"
          size="large"
          dataSource={comments}
          renderItem={(comment) => (
            <Card
              key={comment._id}
              style={{ marginBottom: "20px" }}
              title={<strong>{comment.customer_id.full_name}</strong>}
            >
              <p>{comment.content}</p>

              {comment._id === editingCommentId ? (
                <div>
                  <TextArea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={4}
                    style={{ marginBottom: "10px" }}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleUpdateComment(comment._id)}
                    style={{ marginRight: "10px" }}
                  >
                    Cập nhật
                  </Button>
                  <Button onClick={() => setEditingCommentId(null)}>Hủy</Button>
                </div>
              ) : (
                <div>
                  {customer?._id === comment?.customer_id?._id && (
                    <>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditedContent(comment.content);
                        }}
                        style={{ marginRight: "10px" }}
                      >
                        Sửa
                      </Button>
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteComment(comment._id)}
                        danger
                      >
                        Xóa
                      </Button>
                    </>
                  )}
                </div>
              )}
            </Card>
          )}
        />
      )}

      {/* Form thêm bình luận */}
      {customer && (
        <Card style={{ marginTop: "20px" }}>
          <Form layout="vertical">
            <Form.Item label="Viết bình luận của bạn...">
              <TextArea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                placeholder="Viết bình luận của bạn..."
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Thêm bình luận
            </Button>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default Comment;
