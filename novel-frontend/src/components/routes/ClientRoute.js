import React from 'react'
import Footers from '../Footer'
import Headers from '../Header'
import Banner from '../Banner'
import { BrowserRouter, Routes, Route } from "react-router-dom"

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