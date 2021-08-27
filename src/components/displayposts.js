import DeletePost from './deletepost'
import EditPost from './editpost'
import { FaThumbsUp, FaSadTear } from 'react-icons/fa';

import UsersWhoLiked from './userswholikedpost';

const DisplayPosts = ({
    posts,
    editPost,
    handleUpdatePost,
    setEditPost,
    handleModel,
    handleLike,
    userDetails,
    errorMessage,
    handleMouseHover,
    handleMouseHoverLeave,
    isHovering,
    postLikedBy,
}) => {
    const { loggedInOwnerId} = userDetails;
    return(
        <>
            {
                posts.length >= 1 ? <h1>Blog Posts  <FaThumbsUp /></h1> : <p>You have no posts yet, try posting one</p>
            }
            <div className="posts-grid">
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
                            <div
                                onMouseEnter={() => handleMouseHover(post.id)}
                                onMouseLeave={() => handleMouseHoverLeave()}
                                onClick={(e) => handleLike(post.id)}
                            >
                                <p style={{width: '25px', cursor: 'pointer'}}>
                                    <FaThumbsUp className={post.likes.items.length > 0 && 'liked'} />
                                </p><span> {post.likes.items.length} </span>
                            </div>
                            {isHovering && 
                            
                            <div className="users-liked">
                                {postLikedBy.length === 0 ? 'Liked by no one yet..' : 'liked by: ' }
                                {postLikedBy.length === 0 ? <FaSadTear/> : <UsersWhoLiked data={postLikedBy}/>}
                          
                            </div>
                            
                            }
                              
                        </div>
                    </div>
                    )
                })
            }
            </div>
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
