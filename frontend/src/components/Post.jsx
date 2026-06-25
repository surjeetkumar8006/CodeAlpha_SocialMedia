import React, { useState, useContext } from 'react';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Post = ({ post }) => {
    const { user } = useContext(AuthContext);
    const [likes, setLikes] = useState(post.likes);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(() => {
        const bookmarks = JSON.parse(localStorage.getItem('social_bookmarks') || '[]');
        return bookmarks.includes(post._id);
    });

    const isLiked = user && likes.includes(user.id);

    const handleLike = async () => {
        if (!user) return alert('Please login to like');
        try {
            const token = localStorage.getItem('social_token');
            const res = await axios.put(`http://localhost:5001/api/posts/like/${post._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLikes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem('social_bookmarks') || '[]');
        let updated;
        if (bookmarks.includes(post._id)) {
            updated = bookmarks.filter(id => id !== post._id);
            setIsBookmarked(false);
        } else {
            updated = [...bookmarks, post._id];
            setIsBookmarked(true);
        }
        localStorage.setItem('social_bookmarks', JSON.stringify(updated));
    };

    const loadComments = async () => {
        if (!showComments) {
            try {
                const res = await axios.get(`http://localhost:5001/api/posts/comment/${post._id}`);
                setComments(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        setShowComments(!showComments);
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to comment');
        try {
            const token = localStorage.getItem('social_token');
            const res = await axios.post(`http://localhost:5001/api/posts/comment/${post._id}`, { text: commentText }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments([{ ...res.data, user: { name: user.name, profilePic: user.profilePic } }, ...comments]);
            setCommentText('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card">
            <Link to={`/profile/${post.user._id}`} className="post-header">
                <img src={post.user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(post.user.name)}`} alt="avatar" className="avatar" />
                <div>
                    <h4 style={{ margin: 0, color: 'var(--text-color)' }}>{post.user.name}</h4>
                    <small style={{ color: 'var(--secondary-text)' }}>{new Date(post.createdAt).toLocaleString()}</small>
                </div>
            </Link>
            
            <p style={{ marginBottom: '1rem', lineHeight: '1.5' }}>{post.text}</p>
            {post.imageUrl && <img src={post.imageUrl} alt="post" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />}
            
            <div className="post-actions">
                <button className="post-action-btn" style={{ color: isLiked ? 'var(--primary-color)' : 'var(--secondary-text)' }} onClick={handleLike}>
                    <Heart size={20} fill={isLiked ? 'var(--primary-color)' : 'none'} /> {likes.length} Likes
                </button>
                <button className="post-action-btn" onClick={loadComments}>
                    <MessageCircle size={20} /> Comments
                </button>
                <button className="post-action-btn" style={{ marginLeft: 'auto', color: isBookmarked ? 'var(--primary-color)' : 'var(--secondary-text)' }} onClick={handleBookmark} title="Bookmark Post">
                    <Bookmark size={20} fill={isBookmarked ? 'var(--primary-color)' : 'none'} /> {isBookmarked ? 'Saved' : 'Save'}
                </button>
            </div>

            {showComments && (
                <div style={{ marginTop: '1rem' }}>
                    <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Write a comment..." 
                            value={commentText} 
                            onChange={e => setCommentText(e.target.value)} 
                            required 
                        />
                        <button type="submit" className="btn">Post</button>
                    </form>
                    <div style={{ marginTop: '1rem' }}>
                        {comments.map(c => (
                            <div key={c._id} className="comment-box">
                                <strong>{c.user.name}</strong>
                                <p style={{ margin: 0, marginTop: '5px' }}>{c.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
