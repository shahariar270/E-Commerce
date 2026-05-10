import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComments, createComment, deleteComment } from '@Store/slices/commentSlice';
import Button from '@Component/Buttons';
import './styles.scss';

const CommentItem = ({ comment, onReply, onDelete, currentUserId }) => {
    const isAuthor = currentUserId === comment.author?._id;
    
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
                    {!comment.parent && (
                        <button className="st-comment-item__action-btn" onClick={() => onReply(comment)}>
                            Reply
                        </button>
                    )}
                    {isAuthor && (
                        <button className="st-comment-item__action-btn st-comment-item__action-btn--delete" onClick={() => onDelete(comment._id)}>
                            Delete
                        </button>
                    )}
                </div>
            </div>
            <div className="st-comment-item__content">
                {comment.content}
            </div>
        </div>
    );
};

export const Comments = ({ productId }) => {
    const dispatch = useDispatch();
    const { comments, loading } = useSelector(state => state.comment);
    const { user } = useSelector(state => state.auth);
    const [content, setContent] = useState('');
    const [replyTo, setReplyTo] = useState(null);

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
            // Refetch to get populated authors for new comments
            dispatch(getComments(productId));
        });
    };

    const handleDelete = (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            dispatch(deleteComment(commentId)).then(() => {
                dispatch(getComments(productId));
            });
        }
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
                                currentUserId={user?.id}
                            />
                            <div className="st-comment-group__replies">
                                {comment.children?.map(reply => (
                                    <CommentItem
                                        key={reply._id}
                                        comment={reply}
                                        onDelete={handleDelete}
                                        currentUserId={user?.id}
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
