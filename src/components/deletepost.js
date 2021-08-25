import { API, graphqlOperation } from 'aws-amplify'
import { deletePost } from '../graphql/mutations';

const DeletePost = ({post}) => {
    const handleDeletePost = async (postId) => {
          const input = {
            id: postId
          }
           await API.graphql(graphqlOperation(deletePost, {input}))
      
      }

    return (
        <button onClick={() => handleDeletePost(post.id)} className="button">
            Delete
        </button>
    )
}

export default DeletePost
