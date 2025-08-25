import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { store } from "../store/store.js";
import { useEffect } from 'react'
// services
import { toyActions } from "../store/actions/toy.actions.js";

//pages
import { HomePage } from "./pages/HomePage.jsx"
import { ToyIndex } from "./pages/ToyIndex.jsx";
import { ToyEdit } from "./pages/ToyEdit.jsx";

//cmps
import { AppHeader } from "./cmps/AppHeader.jsx";
import { Provider } from "react-redux";
import { ToyDetails } from "./pages/ToyDetails.jsx";
import { About } from "./pages/About.jsx";

function RootCmp() {

  useEffect(() => {
    loadLabels()
  })

  function loadLabels() {
    return toyActions.loadLabels()
      .catch(err => {
        console.log('err:', err)
      })
  }


  return (
    <Provider store={store}>
      <Router>
        <section className="app-container">
          <AppHeader />
          <main className="app-main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/toy" element={<ToyIndex />} />
              <Route path="/toy/:toyId" element={<ToyDetails />} />
              <Route path="/toy/edit" element={<ToyEdit />} />
              <Route path="/toy/edit/:toyId" element={<ToyEdit />} />
            </Routes>
          </main>
        </section>
      </Router>
    </Provider >
  )
}

export default RootCmp
