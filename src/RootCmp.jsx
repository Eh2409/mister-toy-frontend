import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

//pages
import { HomePage } from "./pages/HomePage.jsx"
//cmps
import { AppHeader } from "./cmps/AppHeader.jsx";

function RootCmp() {


  return (
    <Router>
      <section className="app-container">
        <AppHeader />
        <main className="app-main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </section>
    </Router>
  )
}

export default RootCmp
