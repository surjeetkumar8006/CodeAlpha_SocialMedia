import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from '../components/Post';
import { AuthContext } from '../context/AuthContext';
import { Users } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Profile = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [profileUser, setProfileUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const resUser = await axios.get(`${API_BASE_URL}/api/users/${id}`);
                setProfileUser(resUser.data);

                const resPosts = await axios.get(`${API_BASE_URL}/api/posts`);
                // Filter posts for this user
                setUserPosts(resPosts.data.filter(p => p.user._id === id));
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, [id]);

    const handleFollow = async () => {
        try {
            const token = localStorage.getItem('social_token');
            const res = await axios.put(`${API_BASE_URL}/api/users/follow/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update the followers list dynamically in the UI
            setProfileUser(prev => {
                const isFollowing = prev.followers.includes(user.id);
                const updatedFollowers = isFollowing
                    ? prev.followers.filter(fid => fid !== user.id)
                    : [...prev.followers, user.id];
                return { ...prev, followers: updatedFollowers };
            });
        } catch (err) {
            console.error(err);
        }
    };

    if (!profileUser) return <h2>Loading...</h2>;

    const isCurrentUser = user && user.id === id;
    const isFollowing = user && profileUser.followers.includes(user.id);

    return (
        <div>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <img src={profileUser.profilePic || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + profileUser.name} alt="avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />
                <h2>{profileUser.name}</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1rem 0', color: 'var(--secondary-text)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Users size={18} /> {profileUser.followers.length} Followers</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Users size={18} /> {profileUser.following.length} Following</span>
                </div>
                {!isCurrentUser && user && (
                    <button className="btn" onClick={handleFollow}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Posts by {profileUser.name}</h3>
            <div>
                {userPosts.length > 0 ? (
                    userPosts.map(post => <Post key={post._id} post={post} />)
                ) : (
                    <p>No posts yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
