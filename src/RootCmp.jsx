import { Route, HashRouter as Router, Routes } from "react-router-dom";
// import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { store } from "../store/store.js";
import { useEffect } from 'react'
import { Provider } from "react-redux";

// services
import { toyActions } from "../store/actions/toy.actions.js";

//pages
import { HomePage } from "./pages/HomePage.jsx"
import { ToyIndex } from "./pages/ToyIndex.jsx";
import { ToyDetails } from "./pages/ToyDetails.jsx";
import { ToyEdit } from "./pages/ToyEdit.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { About } from "./pages/About.jsx";
import { UserDetails } from "./pages/UserDetails.jsx";
import { ReviewExplore } from "./pages/ReviewExplore.jsx";

//cmps
import { AppHeader } from "./cmps/AppHeader.jsx";

function RootCmp() {

  useEffect(() => {
    const filterBy = { sortType: 'createdAt', dir: -1, inStock: true }
    loadToys(filterBy)
    loadLabels()
  }, [])

  async function loadToys(filterBy) {
    try {
      await toyActions.load(filterBy)
    } catch (err) {
      console.log('err:', err)
    }
  }

  async function loadLabels() {
    try {
      await toyActions.loadLabels()
    } catch (err) {
      console.log('err:', err)
    }
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/toy" element={<ToyIndex />} />
              <Route path="/toy/:toyId" element={<ToyDetails />} />
              <Route path="/toy/edit" element={<ToyEdit />} />
              <Route path="/toy/edit/:toyId" element={<ToyEdit />} />
              <Route path="/user/:userId" element={<UserDetails />} />
              <Route path="/review" element={<ReviewExplore />} />
            </Routes>
          </main>
        </section>
      </Router>
    </Provider >
  )
}

export default RootCmp
