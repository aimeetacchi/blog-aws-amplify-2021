import DeletePost from './deletepost'
import EditPost from './editpost'
import { FaThumbsUp } from 'react-icons/fa';

const DisplayPosts = ({
    posts,
    editPost,
    handleUpdatePost,
    setEditPost,
    handleModel,
    handleLike,
    userDetails,
    errorMessage,
}) => {
    const { loggedInOwnerId} = userDetails;
    return(
        <>
            {
                posts.length >= 1 ? <h1>Blog Posts  <FaThumbsUp /></h1> : <p>You have no posts yet, try posting one</p>
            }
      
            {
                posts && posts.map((post) => {
                    return (
                    <div className="posts" key={post.id} style={rowStyle}>
                        <div>
                            <h2>{post.postTitle}</h2>
                            <p>{post.postBody}</p>
                            <small>Post Written By: {post.postOwnerUsername}</small>
                            <br/>
                            <p>Date Created: <small style={{fontStyle: "italic"}}>{new Date(post.createdAt).toDateString()}</small></p>

                            {loggedInOwnerId === post.postOwnerId &&
                                <>
                                    <EditPost 
                                        handleUpdatePost={handleUpdatePost}
                                        post={post}
                                        editPost={editPost}
                                        setEditPost={setEditPost}
                                        handleModel={handleModel}
                                    />
                                    <DeletePost post={post} />
                                </>
                            }
                            <p className="alert">{loggedInOwnerId === post.postOwnerId && errorMessage}</p>
                            <p style={{width: '25px', cursor: 'pointer'}} onClick={(e) => handleLike(post.id)}><FaThumbsUp/></p> {post.likes.items.length}
                        </div>
                    </div>
                    )
                })
            }
        </>
    )
}

const rowStyle = {
    backgroundColor: '#ccc',
    padding: '10px',
    border: '1px dashed black',
    margin: '20px 0',
}

export default DisplayPosts
