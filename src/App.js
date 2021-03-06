import { useEffect, useState } from 'react'
import { listPosts } from './graphql/queries'
import { updatePost, createLike } from './graphql/mutations'
import { onCreateLike, onCreatePost, onDeletePost, onUpdatePost } from './graphql/subscriptions';

import { API, graphqlOperation, Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react';

import './App.css';
import DisplayPosts from './components/displayposts';
import CreatePost from './components/createpost';

const App = () => {

  const [posts, setPosts] = useState([]);
  const [subscribePost, setSubscribePost] = useState({});

  const [loggedInOwnerId, setLoggedInOwnerId] = useState('');
  const [loggedInOwnerUsername, setLoggedInOwnerUsername] = useState('');

  const [isHovering, setIsHovering] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [postLikedBy, setPostLikedBy] = useState([]);

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

  const likedPost = (postId) => {
      for(let post of posts) {
        if(post.id === postId) {
          if(post.postOwnerId === loggedInOwnerId) return true
            
          for (let like of post.likes.items) {
              if(like.likeOwnerId === loggedInOwnerId) return true
            }
        }
      }
      return false;
  }

  // setTimeout(() => {
  //   console.log(posts)
  // }, 5000)

  const getCurrentUser = async() => {
    await Auth.currentUserInfo().then(
      user => {
        setLoggedInOwnerUsername(user.username)
        setLoggedInOwnerId(user.attributes.sub)
      }
    )
  }
  let subscriptionOnCreate, subscriptionOnDelete, subscriptionOnUpdate, subscriptionOnLike;

  // LIVE UPDATES =====
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

    subscriptionOnLike = API.graphql(graphqlOperation(onCreateLike)).subscribe({
      next: (postData) => {
        console.log('running subscribe to liking post')
        const createdLike = postData.value.data.onCreateLike;
        setSubscribePost(createdLike)

      }
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

  const handleMouseHover = async (postId) => {
      setIsHovering(!isHovering);

      let innerLikes = postLikedBy;
      for(let post of posts) {
        if(post.id === postId) {
          for(let like of post.likes.items) {
            innerLikes.push(like.likeOwnerUsername)
          }
        }
        setPostLikedBy(innerLikes);
      }
      console.log('posts liked by:', postLikedBy)
     
  }

  const handleMouseHoverLeave = async () => {
      setIsHovering(!isHovering);
      setPostLikedBy([]);
  }

  const handleLike = async (postId) => {
    if(likedPost(postId)) { 
      return setErrorMessage("Can't like your own post");
    } else {
      console.log('clicking like button');

      const input = {
        numberLikes: 1,
        likeOwnerId: loggedInOwnerId,
        likeOwnerUsername: loggedInOwnerUsername,
        likePostId: postId
      }

      try {
        const result = await API.graphql(graphqlOperation(createLike, { input }))

        console.log("Liked:", result.data);
      } catch(err) {
        console.error(err)

      }
    }
  }

  useEffect(() => {
    getPosts();
    likedPost();
    getCurrentUser();
  }, [subscribePost])
  
  useEffect(() => {  
    setupSubscriptions();

    return () =>  {
      subscriptionOnCreate.unsubscribe();  
      subscriptionOnUpdate.unsubscribe();
      subscriptionOnDelete.unsubscribe(); 
      subscriptionOnLike.unsubscribe(); 
    }

  }, [])


  return (
    <div className="App">
      <h1>Blog with AWS Amplify</h1>
      <CreatePost userDetails={{loggedInOwnerId, loggedInOwnerUsername}}/>
      <DisplayPosts
        userDetails={{loggedInOwnerId, loggedInOwnerUsername}}
        handleUpdatePost={handleUpdatePost}
        posts={posts}
        editPost={editPost}
        setEditPost={setEditPost}
        handleModel={handleModel}
        handleLike={handleLike}
        errorMessage={errorMessage}
        handleMouseHover={handleMouseHover}
        postLikedBy={postLikedBy}
        isHovering={isHovering}
        handleMouseHoverLeave={handleMouseHoverLeave}
      />
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true});
