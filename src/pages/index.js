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
