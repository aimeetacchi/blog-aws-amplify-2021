
const EditPost = ({
    post,
    editPost,
    setEditPost,
    handleUpdatePost,
    handleModel
}) => {

    return (
        
        <>  
            {
               editPost.show && (
                    <div className="modal">
                        <button onClick={() => handleModel()} className="close">X</button>

                        <form className="add-post" onSubmit={(e) => handleUpdatePost(e)}>
                            <input
                            type="text"
                            onChange={(e) => setEditPost({
                                ...editPost, postTitle: e.target.value
                            })}
                            placeholder="Title"
                            style={{ font: '19px'}}
                            name="postTitle"
                            value={editPost.postTitle}
                            required
                            />
                            <textarea
                                type="text"
                                name="postBody"
                                cols="40"
                                rows="3"
                                required
                                onChange={(e) => setEditPost({
                                    ...editPost, postBody: e.target.value
                                })}
                                value={editPost.postBody}
                            />
                            <input
                                type="submit"
                                className="btn"
                                style={{ fontSize: '19px'}}
                            />
                        </form>
                    </div>
                )
            }
            <button id={post.id} onClick={() => handleModel(post.id)} className="button">
                Edit
            </button>
        </>
    )
}

export default EditPost
