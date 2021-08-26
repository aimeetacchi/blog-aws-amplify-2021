import { API, graphqlOperation } from 'aws-amplify';
import { createPost } from '../graphql/mutations';
import {useEffect, useState } from 'react'

function CreatePost({userDetails}) {
    const { loggedInOwnerUsername, loggedInOwnerId } = userDetails;
    const [ postTitle, setPostTitle] = useState('');
    const [ postBody, setPostBody] = useState('');

    const onSubmit = async(e) => {
        e.preventDefault(e);
        console.log(loggedInOwnerUsername, loggedInOwnerId)
        const input = {
            postOwnerId: loggedInOwnerId,
            postTitle,
            postBody,
            postOwnerUsername: loggedInOwnerUsername,
            createdAt: new Date().toISOString()
        }

        await API.graphql(graphqlOperation(createPost, { input }))

        // clearing form fields empty state
        setPostTitle('');
        setPostBody('');
    }

    useEffect(() => {
        // do something
    }, [])


    return (
        <div>
            <form className="add-post" onSubmit={onSubmit}>
                <input
                type="text"
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Add title"
                style={{ font: '19px'}}
                name="postTitle"
                value={postTitle}
                required
                />
                <textarea
                    type="text"
                    name="postBody"
                    cols="40"
                    rows="3"
                    required
                    onChange={(e) => setPostBody(e.target.value)}
                    value={postBody}
                    placeholder="Add some content here."
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

export default CreatePost
