import { useEffect, useState } from 'react';

import Post from './Post';
import NewPost from './NewPost';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

const BACKEND_URL = "https://backend-rivas-9rq7.vercel.app"; // Updated backend URL

function PostsList({ isPosting, onStopPosting }) {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchPosts() {
			setLoading(true);
			const response = await fetch(`${BACKEND_URL}/posts`);
			const resData = await response.json();
			setPosts(resData.posts);
			setLoading(false);
		}

		fetchPosts();
	}, []);

	async function addPostHandler(postData) {
		setLoading(true);
		await fetch(`${BACKEND_URL}/posts`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		});
		setLoading(false);

		setPosts((existingData) => [postData, ...existingData]);
	}

	return (
		<>
			{isPosting && (
				<Modal onCloseModal={onStopPosting}>
					<NewPost
						onCancel={onStopPosting}
						onAddPost={addPostHandler}
					/>
				</Modal>
			)}

			{loading && <LoadingSpinner />}

			{!loading && posts.length > 0 && (
				<ul className='posts'>
					{posts.map((post, index) => (
						<Post
							key={index}
							author={post.author}
							body={post.body}
						/>
					))}
				</ul>
			)}

			{!loading && posts.length === 0 && (
				<div style={{ textAlign: 'center', color: 'white' }}>
					<h2>There is no post yet.</h2>
					<p>Try to add some!</p>
				</div>
			)}
		</>
	);
}

export default PostsList;
