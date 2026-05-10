import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComments, createComment, deleteComment, updateComment } from '@Store/slices/commentSlice';
import Button from '@Component/Buttons';
import { jwtDecode } from 'jwt-decode';
import './styles.scss';

const CommentItem = ({ comment, onReply, onDelete, onUpdate, currentUserId, isAdmin }) => {
    const isAuthor = currentUserId === comment.author?._id;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const handleUpdate = () => {
        if (!editContent.trim() || editContent === comment.content) {
            setIsEditing(false);
            return;
        }
        onUpdate(comment._id, editContent);
        setIsEditing(false);
    };

    return (
        <div className={`st-comment-item ${comment.parent ? 'st-comment-item--reply' : ''}`}>
            <div className="st-comment-item__header">
                <div className="st-comment-item__avatar">
                    {comment.author?.image ? (
                        <img src={comment.author.image} alt={comment.author?.user_name} />
                    ) : (
                        <div className="st-comment-item__avatar-placeholder">
                            {comment.author?.user_name?.[0]?.toUpperCase() || '?'}
                        </div>
                    )}
                </div>
                <div className="st-comment-item__info">
                    <span className="st-comment-item__author">{comment.author?.user_name || 'Anonymous'}</span>
                    <span className="st-comment-item__date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="st-comment-item__actions">
                    {!comment.parent && !isEditing && (
                        <button className="st-comment-item__action-btn" onClick={() => onReply(comment)} title="Reply">
                            Reply
                        </button>
                    )}
                    {isAuthor && !isEditing && (
                        <button className="st-comment-item__action-btn" onClick={() => setIsEditing(true)} title="Edit">
                            <span className="st-icon--edit"></span>
                        </button>
                    )}
                    {(isAuthor || isAdmin) && !isEditing && (
                        <button className="st-comment-item__action-btn st-comment-item__action-btn--delete" onClick={() => onDelete(comment._id)} title="Delete">
                            <span className="st-icon--delete"></span>
                        </button>
                    )}
                </div>
            </div>
            <div className="st-comment-item__content">
                {isEditing ? (
                    <div className="st-comment-item__edit-form">
                        <textarea
                            className="st-text-area"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="st-comment-item__edit-actions">
                            <button className="st-comment-item__action-btn" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                            <button className="st-comment-item__action-btn" onClick={handleUpdate}>
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    comment.content
                )}
            </div>
        </div>
    );
};

export const Comments = ({ productId }) => {
    const dispatch = useDispatch();
    const { comments, loading } = useSelector(state => state.comment);
    const { token } = useSelector(state => state.auth);
    const [content, setContent] = useState('');
    const [replyTo, setReplyTo] = useState(null);

    let currentUser = null;
    if (token) {
        try {
            currentUser = jwtDecode(token);
        } catch (e) {
            console.error("Token decode error", e);
        }
    }

    const isAdmin = currentUser?.user_role === 'admin';
    const currentUserId = currentUser?.id;

    useEffect(() => {
        if (productId) {
            dispatch(getComments(productId));
        }
    }, [dispatch, productId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        dispatch(createComment({
            productId,
            content,
            parent: replyTo?._id || null
        })).then(() => {
            setContent('');
            setReplyTo(null);
        });
    };

    const handleDelete = (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            dispatch(deleteComment(commentId));
        }
    };

    const handleUpdate = (commentId, content) => {
        dispatch(updateComment({ commentId, content }));
    };

    return (
        <div className="st-comments">
            <div className="st-comments__form-container">
                <h3>{replyTo ? `Reply to ${replyTo.author?.user_name}` : 'Ask a Question'}</h3>
                <form onSubmit={handleSubmit} className="st-comments__form">
                    <textarea
                        className="st-text-area"
                        placeholder={replyTo ? "Write your reply..." : "Write your question here..."}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="st-comments__form-actions">
                        {replyTo && (
                            <Button
                                label="Cancel"
                                variant="secondary"
                                onClick={() => {
                                    setReplyTo(null);
                                    setContent('');
                                }}
                            />
                        )}
                        <Button
                            label={replyTo ? "Post Reply" : "Post Question"}
                            type="submit"
                            disabled={!content.trim()}
                        />
                    </div>
                </form>
            </div>

            <div className="st-comments__list">
                {loading && comments.length === 0 ? (
                    <p>Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="st-comments__empty">No questions yet. Be the first to ask!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment._id} className="st-comment-group">
                            <CommentItem
                                comment={comment}
                                onReply={setReplyTo}
                                onDelete={handleDelete}
                                onUpdate={handleUpdate}
                                currentUserId={currentUserId}
                                isAdmin={isAdmin}
                            />
                            <div className="st-comment-group__replies">
                                {comment.children?.map(reply => (
                                    <CommentItem
                                        key={reply._id}
                                        comment={reply}
                                        onDelete={handleDelete}
                                        onUpdate={handleUpdate}
                                        currentUserId={currentUserId}
                                        isAdmin={isAdmin}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;
