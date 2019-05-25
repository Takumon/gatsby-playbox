import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import axios from "axios"

class BlogIndex extends React.Component {
  state = {
    loading: false,
    error: false,
    hello: null,
    events:[],
  }

  componentDidMount() {
    this.fetch()
  }

  async fetch() {
    this.setState({ loading: true })
    try {
      const events = this.props.data.allConnpassEventsJson.edges.map(({node}) => node)
      const event_id = events.map(e => e.event_id).join(',')
      const connpassOption = { params: {'event_id': event_id }}

      const { data: dataHello } = await axios.get("/.netlify/functions/hello")
      const { data: dataConnpass } = await axios.get('/.netlify/functions/connpass', connpassOption)
      console.log(dataConnpass)
      this.setState({
        loading: false,
        hello: dataHello.msg,
        events: dataConnpass.events.map(event => {
          const target = events.find(e => e.event_id === '' + event.event_id)

          return {
            ...event,
            thumbnail_url: target.thumbnail_url,
          }
        }),
      })
    } catch(error) {
      this.setState({
        loading: false, error
      })
    }
  }

  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    const helloText =
      this.state.loading
        ? 'Please hold, hello incoming!'

        : this.state.hello
          ? this.state.hello

          : 'Hello not found'

    const eventArea =
      this.state.loading
        ? <p>'Please hold, events incoming!'</p>

        : this.state.events.length === 0
          ? <p>'Events not found'</p>

          : this.state.events.map(event =>
              <div key={event.event_id} >
                <img src={event.thumbnail_url} alt="thumbnail"/>
                <p>{event.started_at}</p>
                <p>{event.title}</p>
                <p>{event.address} {event.place}</p>
              </div>
            )


    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        {
          <form action="/thanks" name="contact" method="POST" data-netlify="true">
            <input type="hidden" name="form-name" value="contact" />
            <p>
              <label>名前: <input type="text" name="name" required /></label>
            </p>
            <p>
              <label>メール: <input type="email" name="email" required /></label>
            </p>
            <p>
              <label>お問い合わせ内容: <select name="reason" required>
              <option value="1">質問1</option>
              <option value="2">質問2</option>
              <option value="3">質問3</option>
              <option value="4">質問4</option>
              </select></label>
            </p>
            <p>
              <label>メッセージ: <textarea name="message"></textarea></label>
            </p>
            <p>
              <button type="submit">送信</button>
            </p>
          </form>
        }
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {helloText}
        </p>
        <div>{eventArea}</div>

        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small>{node.frontmatter.date}</small>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allConnpassEventsJson {
      edges {
        node {
          event_id
          thumbnail_url
        }
      }
    } 
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
