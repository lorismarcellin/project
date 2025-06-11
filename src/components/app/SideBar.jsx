/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import Logo from "../../../public/images/icon.jpg"
import "../../styles/app/sidebar.css"
import { Link } from "react-router-dom"
import { Button } from "primereact/button"

export default function SideBar({ isMobile, setAsideVisible }) {
   const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
   const toggleSubMenu = (e) => {
      e.preventDefault()
      e.stopPropagation()
      e.target.classList.toggle("collapse-show")
      if (isSidebarMinimized) {
         setIsSidebarMinimized(false)
      }
   }
   useEffect(() => {
      const main = document.querySelector(".main")
      if (isSidebarMinimized) {
         if (main) {
            main.classList.add("minimized")
         }
         const allShown = document.querySelectorAll(".collapse.show")
         if (allShown.length > 0) {
            allShown.forEach((element) => {
               element.classList.remove("show")
            })
         }
         const allCollapsed = document.querySelectorAll(`.nav-item a[aria-expanded="true"]`)
         if (allCollapsed.length > 0) {
            allCollapsed.forEach((element) => {
               element.classList.remove("collapsed")
               element.setAttribute("aria-expanded", false)
            })
         }
      } else {
         if (main) {
            main.classList.remove("minimized")
         }
      }
   }, [isSidebarMinimized])
   return (
      <aside
         className={`sidebar d-flex flex-column justify-content-between shadow z-1 ${
            isSidebarMinimized ? "minimized" : ""
         }`}
      >
         <div className="d-flex justify-content-between align-items-center">
            <Link to={"/"} className="d-flex align-items-center px-3 py-2 text-decoration-none link-dark">
               {isMobile ? null : (
                  <Button
                     size="small"
                     severity="secondary"
                     outlined
                     style={{
                        width: 40,
                        height: 40,
                        border: "none",
                     }}
                     rounded
                     className="p-2 mr-2"
                     onClick={(e) => {
                        e.preventDefault()
                        setIsSidebarMinimized((b) => !b)
                     }}
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        className="bi bi-list"
                        viewBox="0 0 16 16"
                     >
                        <path
                           fillRule="evenodd"
                           d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                        />
                     </svg>
                  </Button>
               )}
               <img src={Logo} alt="" className="logo" />
               <h4 className="mx-2 mb-0 app-brandName">ULM</h4>
            </Link>
            {isMobile ? (
               <Button
                  size="small"
                  severity="secondary"
                  outlined
                  style={{
                     width: 40,
                     height: 40,
                     border: "none",
                  }}
                  rounded
                  className="p-2 mr-2"
                  onClick={(e) => {
                     e.preventDefault()
                     setAsideVisible(false)
                  }}
                  icon="pi pi-times"
               />
            ) : null}
         </div>
         <nav className={`px-2 flex-fill`}>
            <div className="nav-item">
               <a
                  onClick={toggleSubMenu}
                  className="text-decoration-none rounded d-block"
                  data-bs-toggle="collapse"
                  href="#administration"
                  role="button"
                  aria-expanded="false"
                  aria-controls="administration"
               >
                  <div className="d-flex align-items-center justify-content-between py-2 px-3">
                     <div className="d-flex align-items-center justify-content-between">
                        <div className="menu-icon">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-database"
                              viewBox="0 0 16 16"
                           >
                              <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313ZM13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 5.698ZM14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13V4Zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 8.698Zm0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525Z" />
                           </svg>
                        </div>
                        <span className="menu-title">Administration</span>
                     </div>
                     <div className="down_caret">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="15"
                           height="15"
                           fill="currentColor"
                           className="bi bi-chevron-right"
                           viewBox="0 0 16 16"
                        >
                           <path
                              fillRule="evenodd"
                              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                           />
                        </svg>
                     </div>
                  </div>
               </a>
            </div>
            <div className="sub-menus collapse" id="administration">
               <div className="nav-item">
                  <Link to={"etudiants"} className="text-decoration-none rounded d-block" href="/etudiants">
                     <div className="d-flex align-items-center justify-content-between py-2 px-3">
                        <div className="d-flex align-items-center justify-content-between">
                           <div className="menu-icon"></div>
                           <span className="menu-title">etudiants</span>
                        </div>
                     </div>
                  </Link>
               </div>
             
               <div className="nav-item">
                  <a
                     className="text-decoration-none rounded d-block"
                     data-bs-toggle="collapse"
                     href="#administration"
                     role="button"
                     aria-expanded="false"
                     aria-controls="administration"
                  >
                    
                  </a>
               </div>
            </div>
            <div className="nav-item">
               <a
                  className="text-decoration-none rounded d-block"
                  data-bs-toggle="collapse"
                  href="#rapport"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
               >
                  <div className="d-flex align-items-center justify-content-between py-2 px-3">
                     <div className="d-flex align-items-center justify-content-between">
                        <div className="menu-icon">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="currentColor"
                              className="bi bi-grid"
                              viewBox="0 0 16 16"
                           >
                              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                           </svg>
                        </div>
                        <span className="menu-title">GESTION</span>
                     </div>
                     <div className="down_caret">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="15"
                           height="15"
                           fill="currentColor"
                           className="bi bi-chevron-right"
                           viewBox="0 0 16 16"
                        >
                           <path
                              fillRule="evenodd"
                              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                           />
                        </svg>
                     </div>
                  </div>
               </a>
            </div>
            <div className="sub-menus collapse" id="rapport">
               <div className="nav-item">
                  <a
                     className="text-decoration-none rounded d-block"
                     data-bs-toggle="collapse"
                     href="/dashboard"
                     role="button"
                     aria-expanded="false"
                     aria-controls="rapport"
                  >
                     <div className="d-flex align-items-center justify-content-between py-2 px-3">
                        <div className="d-flex align-items-center justify-content-between">
                           <div className="menu-icon"></div>
                           <span className="menu-title">Dashboard</span>
                        </div>
                     </div>
                  </a>
               </div>
             
            </div>
 <div className="sub-menus collapse" id="rapport">
               <div className="nav-item">
                  <Link to={"facultes"} className="text-decoration-none rounded d-block" href="/facultes">
                     <div className="d-flex align-items-center justify-content-between py-2 px-3">
                        <div className="d-flex align-items-center justify-content-between">
                           <div className="menu-icon"></div>
                           <span className="menu-title">facultes</span>
                        </div>
                     </div>
                  </Link>
               
               <div className="nav-item">
                  <Link to={"campus"} className="text-decoration-none rounded d-block" href="/campus">
                     <div className="d-flex align-items-center justify-content-between py-2 px-3">
                        <div className="d-flex align-items-center justify-content-between">
                           <div className="menu-icon"></div>
                           <span className="menu-title">Campus</span>
                        </div>
                     </div>
                  </Link>
               </div>
           <div className="nav-item">
                  <Link to={"classes"} className="text-decoration-none rounded d-block" href="/classes">
                     <div className="d-flex align-items-center justify-content-between py-2 px-3">
                        <div className="d-flex align-items-center justify-content-between">
                           <div className="menu-icon"></div>
                           <span className="menu-title">Classes</span>
                        </div>
                     </div>
                  </Link>
               </div>
         </div>
              
            </div>
         </nav>
         <div className="aside-footer px-2 py-3">
            <hr />
            <div className="nav-item">
               <a
                  className="text-decoration-none rounded d-block"
                  data-bs-toggle="collapse"
                  href="#rapport"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
               >
                  <div className="d-flex align-items-center justify-content-between py-2 px-3">
                     <div className="d-flex align-items-center justify-content-between">
                        <div className="menu-icon">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-headset"
                              viewBox="0 0 16 16"
                           >
                              <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5z" />
                           </svg>
                        </div>
                        <span className="menu-title">Custom support</span>
                     </div>
                  </div>
               </a>
            </div>
            <div className="nav-item">
               <a
                  className="text-decoration-none rounded d-block"
                  data-bs-toggle="collapse"
                  href="#rapport"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
               >
                  <div className="d-flex align-items-center justify-content-between py-2 px-3">
                     <div className="d-flex align-items-center justify-content-between">
                        <div className="menu-icon">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-gear"
                              viewBox="0 0 16 16"
                           >
                              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a.873.873 0 0 0 2.692-1.115l.094-.319z" />
                           </svg>
                        </div>
                        <span className="menu-title">Paramètres</span>
                     </div>
                  </div>
               </a>
            </div>
            <div className="nav-item">
               <a
                  className="text-decoration-none rounded d-block"
                  data-bs-toggle="collapse"
                  href="#rapport"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
               >
                  <div className="d-flex align-items-center justify-content-between py-2 px-3">
                     <div className="d-flex align-items-center justify-content-between">
                        <div className="menu-icon">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-box-arrow-left"
                              viewBox="0 0 16 16"
                           >
                              <path
                                 fillRule="evenodd"
                                 d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
                              />
                              <path
                                 fillRule="evenodd"
                                 d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                              />
                           </svg>
                        </div>
                        <span className="menu-title">Déconnexion</span>
                     </div>
                  </div>
               </a>
            </div>
         </div>
      </aside>
   )
}