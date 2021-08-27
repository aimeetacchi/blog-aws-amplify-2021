import React from 'react'

const Userswholikedpost = ({data}) =>  (
       
        data.map((user, i) => (
                <p style={{margin: 0}} key={i}>
                  <strong>{ user }</strong>
                </p>
          )) 
    )


export default Userswholikedpost;
