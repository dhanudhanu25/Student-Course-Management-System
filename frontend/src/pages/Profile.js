import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import ProgressBar from '../components/ProgressBar';
import { authService } from '../services/authService';
import { getImageUrl } from '../services/api';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, updateUser, getProfileCompletion } = useAuth();
  const [activeTab, setActiveTab] = useState('view');
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('email', editForm.email);
      formData.append('phone', editForm.phone);
      if (profileImage) formData.append('profileImage', profileImage);

      const { data } = await authService.updateProfile(formData);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
      setActiveTab('view');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const profileCompletion = getProfileCompletion();

  return (
    <MainLayout>
      <div className={`container py-4 ${styles.page}`}>
        <h1 className={styles.title}>My Profile</h1>

        <div className="row g-4">
          <div className="col-lg-4">
            <div className={styles.profileCard}>
              <div className={styles.avatarWrapper}>
                <img
                  src={preview || getImageUrl(user?.profileImage)}
                  alt={user?.name}
                  className={styles.avatar}
                />
              </div>
              <h3>{user?.name}</h3>
              <p className={styles.email}>{user?.email}</p>
              <span className="badge bg-primary mb-3">{user?.role}</span>
              <ProgressBar progress={profileCompletion} label="Profile Completion" />
              <div className={styles.info}>
                <div><i className="bi bi-telephone"></i> {user?.phone}</div>
                <div><i className="bi bi-calendar"></i> Joined {new Date(user?.createdAt).toLocaleDateString()}</div>
                <div><i className="bi bi-book"></i> {user?.enrolledCourses?.length || 0} Courses</div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className={styles.tabCard}>
              <ul className={`nav nav-tabs ${styles.tabs}`}>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'view' ? 'active' : ''}`} onClick={() => setActiveTab('view')}>
                    View Profile
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>
                    Edit Profile
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
                    Change Password
                  </button>
                </li>
              </ul>

              <div className={styles.tabContent}>
                {activeTab === 'view' && (
                  <div className={styles.viewTab}>
                    <div className="row g-3">
                      <div className="col-md-6"><label>Full Name</label><p>{user?.name}</p></div>
                      <div className="col-md-6"><label>Email</label><p>{user?.email}</p></div>
                      <div className="col-md-6"><label>Phone</label><p>{user?.phone}</p></div>
                      <div className="col-md-6"><label>Role</label><p className="text-capitalize">{user?.role}</p></div>
                    </div>
                  </div>
                )}

                {activeTab === 'edit' && (
                  <form onSubmit={handleUpdateProfile}>
                    <div className="text-center mb-3">
                      <img src={preview || getImageUrl(user?.profileImage)} alt="" className={styles.editAvatar} />
                      <div>
                        <label className="btn btn-outline-primary btn-sm mt-2">
                          Upload Photo
                          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input type="tel" className="form-control" value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                )}

                {activeTab === 'password' && (
                  <form onSubmit={handleChangePassword}>
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <input type="password" className="form-control" value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input type="password" className="form-control" value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input type="password" className="form-control" value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
