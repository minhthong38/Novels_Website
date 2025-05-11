import React from 'react'
import Footers from '../Footer'
import Headers from '../Header'

function ClientRoute(props) {
  return (
    <>
      {/* <Headers /> */}
      <header>
        <Headers />
      </header>
      <body>{props.children}</body>
      {/* <Footers /> */}
      <footer>
        <Footers />
      </footer>
    </>
  )
}

export default ClientRoute