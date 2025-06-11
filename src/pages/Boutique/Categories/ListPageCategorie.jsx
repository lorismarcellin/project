/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState } from "react"
import { useCallback } from "react"
import { useEffect } from "react"
import fetchApi from "../../../helpers/fetchApi"
import { SlideMenu } from "primereact/slidemenu"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { Button } from "primereact/button"
import Loading from "../../../components/app/Loading"
import { InputText } from "primereact/inputtext"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import moment from "moment"
import { setToastAction } from "../../../store/actions/appActions"

const ListPageCategorie = () => {
   const [categories, setCategories] = useState([])
   const [totalRecords, setTotalRecords] = useState(0)
   const [loading, setLoading] = useState(false)
   const [globalLoading, setGloabalLoading] = useState(false)
   const [selectedItems, setSelectedItems] = useState(null)
   const menu = useRef(null)
   const [inViewMenuItem, setInViewMenuItem] = useState(null)
   const [selectAll, setSelectAll] = useState(false)

   const navigate = useNavigate()

   const [lazyState, setlazyState] = useState({
      first: 0,
      rows: 10,
      page: 1,
      sortField: null,
      sortOrder: null,
      search: "",
   })

   const dispacth = useDispatch()

   const onPage = (event) => {
      setlazyState(event)
   }

   const onSort = (event) => {
      setlazyState(event)
   }

   const onFilter = (event) => {
      event["first"] = 0
      setlazyState(event)
   }

   const onSelectionChange = (event) => {
      const value = event.value
      setSelectedItems(value)
      setSelectAll(value.length === totalRecords)
   }

   const onSelectAllChange = (event) => {
      const selectAll = event.checked

      if (selectAll) {
         setSelectAll(true)
         // setSelectedItems(utilisateurs)
      } else {
         setSelectAll(false)
         setSelectedItems([])
      }
   }

   const deleteItems = async (itemsIds) => {
      try {
         setGloabalLoading(true)
         const form = new FormData()
         form.append("ids", JSON.stringify(itemsIds))
         await fetchApi("/category/delete", {
            method: "POST",
            body: form,
         })
         dispacth(
            setToastAction({
               severity: "success",
               summary: " supprimé",
               detail: "L'utilisateur a été supprimé avec succès",
               life: 3000,
            }),
         )
         fetchCatgeorie(lazyState)
         setSelectAll(false)
         setSelectedItems(null)
      } catch (error) {
         console.log(error)
         dispacth(
            setToastAction({
               severity: "error",
               summary: "Erreur du système",
               detail: "Erreur du système, réessayez plus tard",
               life: 3000,
            }),
         )
      } finally {
         setGloabalLoading(false)
      }
   }

   const handleDeletePress = (e, itemsids) => {
      e.preventDefault()
      e.stopPropagation()
      confirmDialog({
         header: "Supprimer ?",
         message: (
            <div className="d-flex flex-column align-items-center">
               {inViewMenuItem ? (
                  <>
                     <div className="font-bold text-center my-2">{inViewMenuItem?.DESIGNATION}</div>
                     <div className="text-center">Voulez-vous vraiment supprimer ?</div>
                  </>
               ) : (
                  <>
                     <div className="text-muted">
                        {selectedItems ? selectedItems.length : "0"} selectionné{selectedItems?.length > 1 && "s"}
                     </div>
                     <div className="text-center">Voulez-vous vraiment supprimer les éléments selectionnés ?</div>
                  </>
               )}
            </div>
         ),
         acceptClassName: "p-button-danger",
         accept: () => {
            deleteItems(itemsids)
         },
      })
   }

   const fetchCatgeorie = useCallback(
      async (currentLazy) => {
         try {
            setLoading(true)
            const baseurl = `/category/all?`
            var url = baseurl
            const params = currentLazy || lazyState
            for (let key in params) {
               const value = params[key]
               if (value) {
                  if (typeof value == "object") {
                     url += `${key}=${JSON.stringify(value)}&`
                  } else {
                     url += `${key}=${value}&`
                  }
               }
            }
            const response = await fetchApi(url)
            setCategories(response.result.data)
            setTotalRecords(response.result.totalRecords)
         } catch (error) {
            console.log(error)
         } finally {
            setLoading(false)
         }
      },
      [lazyState],
   )

   useEffect(() => {
      fetchCatgeorie(lazyState)
   }, [])

   return (
      <>
         <ConfirmDialog closable dismissableMask={true} />
         {globalLoading && <Loading />}
         <div className="px-4 py-3 main_content">
            <div className="d-flex align-items-center justify-content-between">
               <h1 className="mb-3">Catégories</h1>
               <Button
                  label="Nouvelle catégorie"
                  icon="pi pi-plus"
                  size="small"
                  onClick={() => {
                     navigate("/categorie/add")
                  }}
               />
            </div>
            <div className="shadow my-2 bg-white p-3 rounded d-flex align-items-center justify-content-between">
               <div className="d-flex  align-items-center">
                  <div className="p-input-icon-left">
                     <i className="pi pi-search" />
                     <InputText
                        type="search"
                        placeholder="Recherche"
                        className="p-inputtext-sm"
                        style={{ minWidth: 300 }}
                        onInput={(e) => setlazyState((s) => ({ ...s, search: e.target.value }))}
                     />
                  </div>
               </div>
               <div className="selection-actions d-flex align-items-center">
                  <div className="text-muted mx-3">
                     {selectedItems ? selectedItems.length : "0"} selectionné{selectedItems?.length > 1 && "s"}
                  </div>
                  <a
                     href="#"
                     className={`p-menuitem-link link-dark text-decoration-none ${(!selectedItems || selectedItems?.length == 0) && "opacity-50 pointer-events-none"}`}
                     style={{}}
                     onClick={(e) =>
                        handleDeletePress(
                           e,
                           selectedItems.map((item) => item.id),
                        )
                     }
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                        style={{ marginRight: "0.3rem" }}
                     >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                     </svg>
                     <span className="p-menuitem-text">Supprimer</span>
                  </a>
               </div>
            </div>
            <div className="content">
               <div className="shadow rounded mt-3 pr-1 bg-white">
                  <DataTable
                     lazy
                     value={categories}
                     tableStyle={{ minWidth: "50rem" }}
                     className=""
                     paginator
                     rowsPerPageOptions={[5, 10, 25, 50]}
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                     currentPageReportTemplate={`Affichage de {first} à {last} dans ${totalRecords} éléments`}
                     emptyMessage="Aucun utilisateurs trouvé"
                     // paginatorLeft={paginatorLeft}
                     // paginatorRight={paginatorRight}
                     first={lazyState.first}
                     rows={lazyState.rows}
                     totalRecords={totalRecords}
                     onPage={onPage}
                     onSort={onSort}
                     sortField={lazyState.sortField}
                     sortOrder={lazyState.sortOrder}
                     onFilter={onFilter}
                     filters={lazyState.filters}
                     loading={loading}
                     selection={selectedItems}
                     onSelectionChange={onSelectionChange}
                     selectAll={selectAll}
                     onSelectAllChange={onSelectAllChange}
                     reorderableColumns
                     resizableColumns
                     columnResizeMode="expand"
                     paginatorClassName="rounded"
                     scrollable
                     // size="normal"
                  >
                     <Column selectionMode="multiple" frozen headerStyle={{ width: "3rem" }} />
                     <Column
                        field="DESIGNATION"
                        frozen
                        header="Nom"
                        sortable
                        body={(item) => {
                           return <span>{item.DESIGNATION}</span>
                        }}
                     />
                     <Column
                        field="CREATED_AT"
                        frozen
                        header="DATE INSERTION"
                        sortable
                        body={(item) => {
                           return <span>{moment(item.CREATED_AT).format("DD/MM/YYYY HH:mm")}</span>
                        }}
                     />
                     <Column
                        field=""
                        header="Actions"
                        alignFrozen="right"
                        frozen
                        body={(item) => {
                           const items = [
                              {
                                 template: (deleteItem, options) => {
                                    return (
                                       <a
                                          to="#"
                                          className="p-menuitem-link"
                                          // onClick={""}
                                       >
                                          <svg
                                             xmlns="http://www.w3.org/2000/svg"
                                             width="16"
                                             height="16"
                                             fill="currentColor"
                                             className="bi bi-eye-fill"
                                             viewBox="0 0 16 16"
                                             style={{ marginRight: "0.5rem" }}
                                             {...options.iconProps}
                                          >
                                             <path
                                                fillRule="evenodd"
                                                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                                             />
                                          </svg>
                                          <span className="p-menuitem-text">Plus de détails</span>
                                       </a>
                                    )
                                 },
                              },
                              {
                                 template: () => {
                                    return (
                                       <Link
                                          to={`/categorie/edit/${inViewMenuItem?.ID_CATEGORY}`}
                                          className="p-menuitem-link"
                                       >
                                          <svg
                                             xmlns="http://www.w3.org/2000/svg"
                                             width="16"
                                             height="16"
                                             fill="currentColor"
                                             className="bi bi-pencil-square"
                                             viewBox="0 0 16 16"
                                             style={{ marginRight: "0.5rem" }}
                                          >
                                             <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                             <path
                                                fillRule="evenodd"
                                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                             />
                                          </svg>
                                          <span className="p-menuitem-text">Modifier</span>
                                       </Link>
                                    )
                                 },
                              },
                              {
                                 template: () => {
                                    return (
                                       <a
                                          href="#"
                                          className="p-menuitem-link text-danger"
                                          onClick={(e) => handleDeletePress(e, [inViewMenuItem.ID_CATEGORY])}
                                       >
                                          <svg
                                             xmlns="http://www.w3.org/2000/svg"
                                             width="16"
                                             height="16"
                                             fill="currentColor"
                                             className="bi bi-trash"
                                             viewBox="0 0 16 16"
                                             style={{ marginRight: "0.5rem" }}
                                          >
                                             <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                             <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                          </svg>
                                          <span className="p-menuitem-text text-danger">Supprimer</span>
                                       </a>
                                    )
                                 },
                              },
                           ]
                           return (
                              <>
                                 <SlideMenu
                                    ref={menu}
                                    model={items}
                                    popup
                                    viewportHeight={150}
                                    menuWidth={220}
                                    onHide={() => {
                                       setInViewMenuItem(null)
                                    }}
                                 />
                                 <Button
                                    rounded
                                    severity="secondary"
                                    text
                                    aria-label="Menu"
                                    size="small"
                                    className="mx-1"
                                    onClick={(event) => {
                                       setInViewMenuItem(item)
                                       menu.current.toggle(event)
                                    }}
                                 >
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       width="16"
                                       height="16"
                                       fill="currentColor"
                                       className="bi bi-three-dots"
                                       viewBox="0 0 16 16"
                                    >
                                       <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                    </svg>
                                 </Button>
                              </>
                           )
                        }}
                     />
                  </DataTable>
               </div>
            </div>
         </div>
         <Outlet />
      </>
   )
}

export default ListPageCategorie
