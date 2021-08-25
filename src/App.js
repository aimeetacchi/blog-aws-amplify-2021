import { useEffect, useState } from 'react'
import { listPosts } from './graphql/queries'
import { updatePost } from './graphql/mutations'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react';

import './App.css';
import DisplayPosts from './components/displayposts';
import CreatePost from './components/createpost';
import { onCreatePost, onDeletePost, onUpdatePost } from './graphql/subscriptions';

const App = () => {

  const [posts, setPosts] = useState([]);

  const [subscribePost, setSubscribePost] = useState({});

  const [postOwnerId, setPostOwnerId] = useState('');
  const [postOwnerUsername, setPostOwnerUsername] = useState('');
  
  const[editPost, setEditPost] = useState({
    show: false,
    id: '',
    postOwnerId: '',
    postOwnerUsername: '',
    postTitle: '',
    postBody: ''
  })

  const getPosts = async () => {
    const res = await API.graphql(graphqlOperation(listPosts))
    const postsItems = res.data.listPosts.items;
    setPosts(postsItems)
  }

  // setTimeout(() => {
  //   console.log(posts)
  // }, 5000)

  const getCurrentUser = async() => {
    await Auth.currentUserInfo().then(
      user => {
        setPostOwnerUsername(user.username)
        setPostOwnerId(user.attributes.sub)
      }
    )
  }
  let subscriptionOnCreate, subscriptionOnDelete, subscriptionOnUpdate;

  function setupSubscriptions() {
    // CREATING POST SUBSCRIPTION   
    subscriptionOnCreate = API.graphql(graphqlOperation(onCreatePost)).subscribe({
      next: (postData) => {
        setSubscribePost({});       
        console.log('running subscribe to new post!');
        const newPostObject = postData.value.data.onCreatePost
        setSubscribePost(newPostObject)
      },
      error: error => console.warn(error)
    })

    // DELETE SUBSCRIPTION
    subscriptionOnDelete =  API.graphql(graphqlOperation(onDeletePost)).subscribe({
      next: (postData) => {
        setSubscribePost({}); 
        console.log('running subscribe to deleted post')
        const deletedPost = postData.value.data.onDeletePost;
        setSubscribePost(deletedPost);
      },
      error: error => console.warn(error)
    })

    // UPDATE SUBSCRIPTION
    subscriptionOnUpdate =  API.graphql(graphqlOperation(onUpdatePost)).subscribe({
      next: (postData) => {
        setSubscribePost({}); 
        console.log('running subscribe to update post')
        const updatedPost = postData.value.data.onUpdatedPost;
        setSubscribePost(updatedPost);
      },
      error: error => console.warn(error)
    })
  }


  // HANDLE MODEL FOR EDIT POSTS =
  const handleModel = (postid) => {
    console.log('clicking edit...')
    const editPostObject = posts.find(post => post.id === postid);
    
    setEditPost({
    ...editPostObject,
    show: !editPost.show
    })
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }
 
  const handleUpdatePost = async (e) => {
    console.log('updating post...')
    e.preventDefault();

    const input = {
      id: editPost.id,
      postOwnerId: editPost.postOwnerId,
      postOwnerUsername: editPost.postOwnerUsername,
      postTitle: editPost.postTitle,
      postBody: editPost.postBody,
    }

    console.log(input)

    await API.graphql(graphqlOperation(updatePost, {input}))

    setEditPost({
      ...editPost,
      show: !editPost.show
      })

  }

  useEffect(() => {
    getPosts();
    getCurrentUser();
  }, [subscribePost])
  
  useEffect(() => {  
    setupSubscriptions();

    return () =>  {
      subscriptionOnCreate.unsubscribe();  
      subscriptionOnUpdate.unsubscribe();
      subscriptionOnDelete.unsubscribe();  
    }

  }, [])


  return (
    <div className="App">
      <h1>Blog with AWS Amplify</h1>
      <CreatePost userDetails={{postOwnerId, postOwnerUsername}}/>
      <DisplayPosts
        handleUpdatePost={handleUpdatePost}
        posts={posts}
        editPost={editPost}
        setEditPost={setEditPost}
        handleModel={handleModel}
      />
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true});
