import React, { useState } from 'react';
import Modal from 'react-modal';
import './CreatePostModal.css'; // Optional: Create a custom CSS file for styling

// Optional: Make sure the modal is accessible
Modal.setAppElement('#root');

const Post = ({ isOpen, closeModal, onCreatePost }) => {
  const [postDetails, setPostDetails] = useState({
    content: '',
    location: '',
    typeofwork: '',
    durationofwork: '',
    jobimage: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call API to create post (you can handle the post submission here)
    onCreatePost(postDetails);
    closeModal(); // Close the modal after submission
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} contentLabel="Create Post Modal" className="modal">
      <div className="modal-content">
        <h2>Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Post Content</label>
            <textarea
              name="content"
              value={postDetails.content}
              onChange={handleChange}
              placeholder="Enter your post content"
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={postDetails.location}
              onChange={handleChange}
              placeholder="Enter location"
              required
            />
          </div>
          <div className="form-group">
            <label>Type of Work</label>
            <input
              type="text"
              name="typeofwork"
              value={postDetails.typeofwork}
              onChange={handleChange}
              placeholder="Type of work"
              required
            />
          </div>
          <div className="form-group">
            <label>Duration of Work</label>
            <input
              type="text"
              name="durationofwork"
              value={postDetails.durationofwork}
              onChange={handleChange}
              placeholder="Duration"
              required
            />
          </div>
          <div className="form-group">
            <label>Job Image (Optional)</label>
            <input
              type="text"
              name="jobimage"
              value={postDetails.jobimage}
              onChange={handleChange}
              placeholder="URL of image"
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              Create Post
            </button>
            <button type="button" className="cancel-btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Post;
