import React from "react"
import { graphql } from "gatsby"


const ComponentName = ({ data }) => {
  console.log(data)
let blocks = []
{/*<pre>{JSON.stringify(data, null, 4)}</pre>*/}

    {data.arena.channel.blokks.map((blok, index) => {

      if(blok.__typename === "ARENA_Channel"){

        blok.blokks.map((block, index) => {
          if(block.__typename !== "ARENA_Channel"){
          blocks.push(
            <div key={block.id + index} className="blok">
             <div className="title"> {block.title ? block.title :  block.href}</div>
             {block.image_url &&
              <img src={block.image_url}/>
             }
             {block.content &&
              <div className="text">{block.content}</div>
             }
         
             {block.comments &&
              <div className="tags">
                {block.comments.map((comment, index) => {
                  return(
                    <div className="tag">{comment.body}</div>
                    )
                  
                })}
              </div>
            }
            </div>
            )
          }
        })
      }else{

        blocks.push(
          <div key={blok.id + index} className="blok">
            <div className="title">{blok.title ? blok.title :  blok.href}</div>
            {blok.image_url &&
              <img src={blok.image_url}/>
            }
            {blok.content &&
              <div className="text">{blok.content}</div>
             }
       
            {blok.comments &&
              <div className="tags">
                {blok.comments.map((comment, index) => {
                  return(
                    <div className="tag">{comment.body}</div>
                    )
                  
                })}
              </div>
            }
          </div>
          
       )
      }
      })}
 
      return (
    <div>{blocks}</div>
    )
  
}

export const query = graphql`
  {
    arena {
      channel(id: "poetics-lab-site") {
        blokks(per: 100){
          ... on ARENA_Text {
            id
            href
            title
            content
            comments{
              body
            }
          }
          ... on ARENA_Image {
            id
            href
            title
            image_url
            comments{
              body
            }
          }
          ... on ARENA_Link {
            id
            href
            title
            image_url
            comments{
              body
            }
          }
          ... on ARENA_Embed {
            id
            href
            title
            image_url
            comments{
              body
            }
          }
          ... on ARENA_Attachment {
            id
            href
            title
            image_url
            comments{
              body
            }
          }
          ... on ARENA_Channel {
            id
            href
            title
            counts{
              blocks
              channels
            }
            blokks(per: 100){
              ... on ARENA_Text {
                id
                href
                title
                content
                comments{
                  body
                }
              }
              ... on ARENA_Image {
                id
                href
                title
                image_url
                comments{
                  body
                }
              }
              ... on ARENA_Link {
                id
                href
                title
                image_url
                comments{
                  body
                }
              }
              ... on ARENA_Embed {
                id
                href
                title
                image_url
                comments{
                  body
                }
              }
              ... on ARENA_Attachment {
                id
                href
                title
                image_url
                comments{
                  body
                }
              }
              ... on ARENA_Channel {
                id
                href
                title
                counts{
                  blocks
                }
              }
            }
          }
        }
      }
    }
  }
`

export default ComponentName