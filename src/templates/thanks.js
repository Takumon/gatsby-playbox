import React from "react"
import { Link } from "gatsby"

class Thanks extends React.Component {
  render() {
    return (
      <>
        <h1>お問い合わせありがとうございます！</h1>
        <Link to={'/'}>まえに戻る</Link>
      </>
    )
  }
}

export default Thanks
