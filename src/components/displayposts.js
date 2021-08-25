import DeletePost from './deletepost'
import EditPost from './editpost'

const DisplayPosts = ({
    posts,
    editPost,
    handleUpdatePost,
    setEditPost,
    handleModel
}) => (
        <>
            {
                posts.length >= 1 ? <h1>Blog Posts</h1> : <p>You have no posts yet, try posting one</p>
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
                 
                            <EditPost 
                                handleUpdatePost={handleUpdatePost}
                                post={post}
                                editPost={editPost}
                                setEditPost={setEditPost}
                                handleModel={handleModel}
                            />
                            <DeletePost post={post} />
                        </div>
                    </div>
                    )
                })
            }
        </>
    )

const rowStyle = {
    backgroundColor: '#ccc',
    padding: '10px',
    border: '1px dashed black',
    margin: '20px 0',
}

export default DisplayPosts
