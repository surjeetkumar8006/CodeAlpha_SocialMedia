import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Post from '../components/Post';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserPlus, UserMinus, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [newPostText, setNewPostText] = useState('');
    const [showBookmarks, setShowBookmarks] = useState(false);
    const { user } = useContext(AuthContext);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/posts`);
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSuggestedUsers = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('social_token');
            const res = await axios.get(`${API_BASE_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuggestedUsers(res.data.slice(0, 5)); // show top 5 suggestions
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchSuggestedUsers();
    }, [user]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('social_token');
            const res = await axios.post(`${API_BASE_URL}/api/posts`, { text: newPostText }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const newPost = { ...res.data, user: { _id: user.id, name: user.name, profilePic: user.profilePic } };
            setPosts([newPost, ...posts]);
            setNewPostText('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleFollowToggle = async (userId) => {
        try {
            const token = localStorage.getItem('social_token');
            await axios.put(`${API_BASE_URL}/api/users/follow/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Toggle local suggestions list following representation
            setSuggestedUsers(prevUsers => prevUsers.map(u => {
                if (u._id === userId) {
                    const isFollowing = u.followers.includes(user.id);
                    const updatedFollowers = isFollowing
                        ? u.followers.filter(fid => fid !== user.id)
                        : [...u.followers, user.id];
                    return { ...u, followers: updatedFollowers };
                }
                return u;
            }));
            
            // Also refresh feed posts in case layout or feed filtration changes
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1.2fr', gap: '2rem', alignItems: 'start' }} className="feed-grid-layout">
            {/* Left Column: Create Post & Feed */}
            <div>
                {user && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <form onSubmit={handleCreatePost}>
                            <textarea 
                                className="form-control" 
                                rows="3" 
                                placeholder={`What's on your mind, ${user.name}?`} 
                                value={newPostText}
                                onChange={e => setNewPostText(e.target.value)}
                                required
                                style={{ resize: 'none', marginBottom: '10px' }}
                            ></textarea>
                            <button type="submit" className="btn" style={{ width: '100%' }}>Post</button>
                        </form>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '20px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2px' }}>
                    <button 
                        onClick={() => setShowBookmarks(false)} 
                        style={{ background: 'none', border: 'none', fontWeight: !showBookmarks ? '850' : '600', color: !showBookmarks ? 'var(--primary-color)' : 'var(--secondary-text)', cursor: 'pointer', fontSize: '1rem', borderBottom: !showBookmarks ? '2.5px solid var(--primary-color)' : 'none', paddingBottom: '12px', marginBottom: '-2px', transition: '0.2s' }}
                    >
                        All Posts
                    </button>
                    <button 
                        onClick={() => setShowBookmarks(true)} 
                        style={{ background: 'none', border: 'none', fontWeight: showBookmarks ? '850' : '600', color: showBookmarks ? 'var(--primary-color)' : 'var(--secondary-text)', cursor: 'pointer', fontSize: '1rem', borderBottom: showBookmarks ? '2.5px solid var(--primary-color)' : 'none', paddingBottom: '12px', marginBottom: '-2px', transition: '0.2s' }}
                    >
                        Bookmarked
                    </button>
                </div>

                <div>
                    {(() => {
                        const displayedPosts = showBookmarks 
                            ? posts.filter(p => {
                                const bookmarks = JSON.parse(localStorage.getItem('social_bookmarks') || '[]');
                                return bookmarks.includes(p._id);
                              })
                            : posts;
                        
                        if (displayedPosts.length === 0) {
                            return (
                                <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--secondary-text)' }}>
                                    {showBookmarks ? 'No bookmarked posts yet.' : 'No posts yet. Be the first to share something!'}
                                </div>
                            );
                        }
                        
                        return displayedPosts.map(post => <Post key={post._id} post={post} />);
                    })()}
                </div>
            </div>

            {/* Right Column: Suggested Sidebar */}
            <div className="feed-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {user && (
                    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <img 
                            src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`} 
                            alt="my avatar" 
                            className="avatar" 
                            style={{ width: '60px', height: '60px', margin: '0 auto 10px', display: 'block', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <h4 style={{ margin: 0, color: 'var(--text-color)' }}>{user.name}</h4>
                        <small style={{ color: 'var(--secondary-text)' }}>{user.email}</small>
                        <div style={{ marginTop: '15px' }}>
                            <Link to={`/profile/${user.id}`} className="btn" style={{ width: '100%', textDecoration: 'none', fontSize: '0.85rem', padding: '8px 12px' }}>View My Profile</Link>
                        </div>
                    </div>
                )}

                {user && suggestedUsers.length > 0 && (
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem', color: 'var(--text-color)' }}>
                            <Sparkles size={18} style={{ color: 'var(--primary-color)' }} /> Who to Follow
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {suggestedUsers.map(sUser => {
                                const isFollowing = sUser.followers.includes(user.id);
                                return (
                                    <div key={sUser._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                                        <Link to={`/profile/${sUser._id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
                                            <img 
                                                src={sUser.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sUser.name)}`} 
                                                alt="avatar" 
                                                className="avatar" 
                                                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                                            />
                                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }}>
                                                <h5 style={{ margin: 0, fontSize: '0.9rem' }}>{sUser.name}</h5>
                                            </div>
                                        </Link>
                                        <button 
                                            onClick={() => handleFollowToggle(sUser._id)} 
                                            className="btn" 
                                            style={{ 
                                                padding: '6px 12px', 
                                                fontSize: '0.8rem', 
                                                display: 'inline-flex', 
                                                alignItems: 'center', 
                                                gap: '5px',
                                                background: isFollowing ? 'var(--secondary-text)' : 'var(--primary-color)',
                                                color: '#fff'
                                            }}
                                        >
                                            {isFollowing ? (
                                                <>
                                                    <UserMinus size={14} /> Unfollow
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus size={14} /> Follow
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
