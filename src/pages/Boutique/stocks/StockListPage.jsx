/* eslint-disable react-hooks/exhaustive-deps */
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../../store/actions/appActions"
import { stocks_routes_items } from "../../../routes/facultes/faculte_routes"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { Calendar } from "primereact/calendar"
import moment from "moment"
import fetchApi from "../../../helpers/fetchApi"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { SlideMenu } from "primereact/slidemenu"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import Loading from "../../../components/app/Loading"
import { Image } from "primereact/image"
import { useIntl, FormattedMessage } from "react-intl"

export default function StocksListPage() {
   const [selectedCity, setSelectedCity] = useState(null)
   const [date, setDate] = useState(null)
   const [isVisible, setIsVisible] = useState(false)
   const [selectAll, setSelectAll] = useState(false)
   const [loading, setLoading] = useState(true)
   const [totalRecords, setTotalRecords] = useState(1)
   const [stocks, setStocks] = useState([])
   const [selectedItems, setSelectedItems] = useState(null)
   const menu = useRef(null)
   const [inViewMenuItem, setInViewMenuItem] = useState(null)
   const [globalLoading, setGlobalLoading] = useState(false)
   const [articles, setArticles] = useState([]) // <-- Ajoute cet état

   const navigate = useNavigate()
   const intl = useIntl()

   const [lazyState, setlazyState] = useState({
      first: 0,
      rows: 10,
      page: 1,
      sortField: null,
      sortOrder: null,
      search: "",
      filters: {
         ID_ART: { value: "", matchMode: "contains" },
         DESCRIPTION: { value: "", matchMode: "contains" },
         ID_STOCK: { value: "", matchMode: "contains" },
         QUANTITE_ENTR: { value: "", matchMode: "contains" },
         QUANTITE_SORT: { value: "", matchMode: "contains" },
         RESTE: { value: "", matchMode: "contains" },
      },
   })

   const cities = [
      { name: "New York", code: "NY" },
      { name: "Rome", code: "RM" },
      { name: "London", code: "LDN" },
      { name: "Istanbul", code: "IST" },
      { name: "Paris", code: "PRS" },
   ]

   const dispatch = useDispatch()
   const handleVisibility = () => {
      setIsVisible(!isVisible)
   }
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
         setSelectedItems(stocks)
      } else {
         setSelectAll(false)
         setSelectedItems([])
      }
   }

   const deleteItems = async (itemsIds) => {
      try {
         setGlobalLoading(true)
         for (const id of itemsIds) {
            await fetchApi(`/stocks/${id}`, {
               method: "DELETE",
            })
         }
         dispatch(
            setToastAction({
               severity: "success",
               summary: "Stock supprimé",
               detail: "Le stock a été supprimé avec succès",
               life: 3000,
            }),
         )
         fetchStocks()
         setSelectAll(false)
         setSelectedItems(null)
      } catch (error) {
         console.log(error)
         dispatch(
            setToastAction({
               severity: "error",
               summary: "Erreur du système",
               detail: "Erreur du système, réessayez plus tard",
               life: 3000,
            }),
         )
      } finally {
         setGlobalLoading(false)
      }
   }

   const handleDeletePress = (e, itemsIds) => {
      e.preventDefault()
      e.stopPropagation()
      confirmDialog({
         header: "Supprimer ?",
         message: (
            <div className="d-flex flex-column align-items-center">
               {inViewMenuItem ? (
                  <>
                     <img
                        alt="flag"
                        src={inViewMenuItem.IMAGE}
                        className="rounded object-fit-cover"
                        style={{ width: "100px", height: "100px" }}
                     />
                     <div className="font-bold text-center my-2">
                        {inViewMenuItem?.NOM} {inViewMenuItem?.PRENOM}
                     </div>
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
            deleteItems(itemsIds)
         },
      })
   }

   const fetchStocks = useCallback(async () => {
      try {
         setLoading(true)
         const baseurl = "/stocks?"
         let url = baseurl
         for (let key in lazyState) {
            const value = lazyState[key]
            if (value) {
               if (typeof value === "object") {
                  url += `${key}=${encodeURIComponent(JSON.stringify(value))}&`
               } else {
                  url += `${key}=${encodeURIComponent(value)}&`
               }
            }
         }
         const res = await fetchApi(url)
         setStocks(res || [])
         setTotalRecords(res.result?.totalRecords || 0)
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
      }
   }, [lazyState])

   useEffect(() => {
      dispatch(setBreadCrumbItemsAction([stocks_routes_items.stocks]))
      return () => {
         dispatch(setBreadCrumbItemsAction([]))
      }
   }, [])
   useEffect(() => {
      fetchStocks()
   }, [lazyState])

     const fetchArticles = useCallback(async () => {
      try {
         const res = await fetchApi("/articles")
         setArticles(res || [])
      } catch (error) {
         console.log(error)
      }
   }, [])

   // Charge les articles au montage
   useEffect(() => {
      fetchArticles()
   }, [fetchArticles])
   
   return (
      <>
         <ConfirmDialog closable dismissableMask={true} />
         {globalLoading && <Loading />}
         <div className="px-4 py-3 main_content">
            <div className="d-flex align-items-center justify-content-between">
               <h1 className="mb-3">
                  <FormattedMessage id="stocks.title" defaultMessage="Stocks" />
               </h1>
               <Button
                  label={intl.formatMessage({ id: "stocks.new", defaultMessage: "Nouveau stock" })}
                  icon="pi pi-plus"
                  size="small"
                  onClick={() => {
                     navigate("/stocks/new")
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
                  <div className="d-flex align-items-center">
                     <Dropdown
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.value)}
                        options={cities}
                        optionLabel="name"
                        placeholder="Province"
                        className="w-full md:w-14rem mx-3 no-p"
                        showClear
                     />
                     <Button
                        size="small"
                        text
                        className="d-flex flex-column align-items-lg-start py-1"
                        onClick={handleVisibility}
                     >
                        <div className="d-flex align-items-center ">
                           <i className="pi pi-calendar text-muted" />
                           <div className="text-muted mx-2">Date de naissance</div>
                        </div>
                        {date ? <div className="text-dark">{moment(date).format("DD-MM-YYYY")}</div> : null}
                     </Button>
                     <Calendar
                        value={date}
                        onChange={(e) => setDate(e.value)}
                        placeholder="Date de naissance"
                        showOnFocus={false}
                        visible={isVisible}
                        onVisibleChange={handleVisibility}
                        inputStyle={{ opacity: 0, visibility: "hidden", position: "absolute" }}
                        panelStyle={{ transform: "translateX(-75%) translateY(-15px)" }}
                     />
                  </div>
               </div>
               <div className="selection-actions d-flex align-items-center">
                  <div className="text-muted mx-3">
                     {selectedItems ? selectedItems.length : "0"}{" "}
                     <FormattedMessage
                        id="stocks.selected"
                        defaultMessage="selectionné"
                     />
                     {selectedItems?.length > 1 && "s"}
                  </div>
                  <a
                     href="#"
                     className={`p-menuitem-link link-dark text-decoration-none ${(!selectedItems || selectedItems?.length === 0) ? "opacity-50 pointer-events-none" : ""}`}
                     onClick={(e) =>
                        handleDeletePress(
                           e,
                           selectedItems ? selectedItems.map((item) => item.ID_STOCK) : []
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
                     <span className="p-menuitem-text">
                        <FormattedMessage id="delete" defaultMessage="Supprimer" />
                     </span>
                  </a>
               </div>
            </div>
            <div className="content">
               <div className="shadow rounded mt-3 pr-1 bg-white">
                  <DataTable
                     lazy
                     value={stocks}
                     tableStyle={{ minWidth: "50rem" }}
                     paginator
                     rowsPerPageOptions={[5, 10, 25, 50]}
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                     currentPageReportTemplate={`Affichage de {first} à {last} dans ${totalRecords} éléments`}
                     emptyMessage="Aucun stocks trouvé"
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
                  >
                     <Column selectionMode="multiple" frozen headerStyle={{ width: "3rem" }} />
                     <Column
                        field="ID_STOCK"
                        header={intl.formatMessage({ id: "stocks.profilId", defaultMessage: "STOCK ID" })}
                        sortable
                        body={(item) => <span>{item.ID_STOCK}</span>}
                     />
                     <Column
   field="ID_ART"
   header={intl.formatMessage({ id: "stocks.DESCRIPTION", defaultMessage: "Article" })}
   sortable
   body={(item) => {
      const article = articles.find(a => a.ID_ART === item.ID_ART)
      return <span>{article ? article.DESCRIPTION : ""}</span>
   }}
/>
                     <Column
                        field="QUANTITE_ENTR"
                        header={intl.formatMessage({ id: "stocks.QUANTITE_ENTR", defaultMessage: "QUANTITE ENTREE" })}
                        sortable
                        body={(item) => <span>{item.QUANTITE_ENTR}</span>}
                     />
                     <Column
                        field="QUANTITE_SORT"
                        header={intl.formatMessage({ id: "stocks.QUANTITE_SORT", defaultMessage: "QUANTITE SORTIE" })}
                        sortable
                        body={(item) => <span>{item.QUANTITE_SORT}</span>}
                     />
                     <Column
                        field="RESTE"
                        header={intl.formatMessage({ id: "stocks.RESTE", defaultMessage: "RESTE" })}
                        sortable
                        body={(item) => <span>{item.RESTE}</span>}
                     />
                
                     <Column
                        field=""
                        header=""
                        alignFrozen="right"
                        frozen
                        body={(item) => {
                           const items = [
                              {
                                 label: intl.formatMessage({ id: "details", defaultMessage: "Plus de details" }),
                                 icon: (options) => (
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       width="16"
                                       height="16"
                                       fill="currentColor"
                                       className="bi bi-list"
                                       viewBox="0 0 16 16"
                                       {...options.iconProps}
                                    >
                                       <path
                                          fillRule="evenodd"
                                          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
                                       />
                                    </svg>
                                 ),
                              },
                              {
                                 template: () => (
                                    <Link
                                       to={`/stocks/edit/${inViewMenuItem?.ID_STOCK}`}
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
                                       <span className="p-menuitem-text">
                                          <FormattedMessage id="edit" defaultMessage="Modifier" />
                                       </span>
                                    </Link>
                                 ),
                              },
                              {
                                 template: () => (
                                    <a
                                       href="#"
                                       className="p-menuitem-link text-danger"
                                       onClick={(e) => handleDeletePress(e, [inViewMenuItem.ID_STOCK])}
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
                                       <span className="p-menuitem-text text-danger">
                                          <FormattedMessage id="delete" defaultMessage="Supprimer" />
                                       </span>
                                    </a>
                                 ),
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