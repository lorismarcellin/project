/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setBreadCrumbItemsAction, setToastAction } from "../../../store/actions/appActions"
import { stocks_routes_items } from "../../../routes/facultes/faculte_routes"
import { Button } from "primereact/button"
import { useForm } from "../../../hooks/useForm"
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle"
import fetchApi from "../../../helpers/fetchApi"
import { InputText } from "primereact/inputtext"
import { FileUpload } from "primereact/fileupload"
import Loading from "../../../components/app/Loading"
import { useNavigate, useParams } from "react-router-dom"
import { Image } from "primereact/image"
import { Dropdown } from "primereact/dropdown"


const initialForm = {
   ID_ART: "",
   QUANTITE_ENTR: "",
   QUANTITE_SORT: "",
}

export default function EditStockPage() {
   const dispatch = useDispatch()
   const [data, handleChange, setData, setValue] = useForm(initialForm)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const navigate = useNavigate()
   const { idStock } = useParams()
   const [stock, setStock] = useState(null)
   const [loadingStock, setLoadingStock] = useState(true)
   const [profils, setProfils] = useState([])
   const [articles, setArticles] = useState([]) // <-- Add this line

   const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
      ID_ART: { required: true },
      QUANTITE_ENTR: {
         required: true,
         alpha: true,
         length: [0, 50],
      },
      QUANTITE_SORT: {
         required: true,
         alpha: true,
         length: [0, 50],
      },
    
   })

   const handleSubmit = async (e) => {
      try {
         e.preventDefault()
         if (!isValidate()) return false
         setIsSubmitting(true)
         const form = new FormData()
         form.append("ID_ART", data.ID_ART)
         form.append("QUANTITE_ENTR", data.QUANTITE_ENTR)
         form.append("QUANTITE_SORT", data.QUANTITE_SORT)
         await fetchApi(`/stocks/${idStock}`, {
            method: "PUT",
            body: form,
         })
         dispatch(
            setToastAction({
               severity: "success",
               summary: "Stock modifié",
               detail: "Le stock a été modifié avec succès",
               life: 3000,
            }),
         )
         navigate("/stocks")
      } catch (error) {
         if (error.httpStatus === "UNPROCESSABLE_ENTITY") {
            setErrors(error.result)
         } else {
            dispatch(
               setToastAction({
                  severity: "error",
                  summary: "Erreur du système",
                  detail: "Erreur du système, réessayez plus tard",
                  life: 3000,
               }),
            )
         }
      } finally {
         setIsSubmitting(false)
      }
   }

   const fetchStock = useCallback(async () => {
      try {
         setLoadingStock(true)
         const res = await fetchApi(`/stocks/${idStock}`)
         const uti = res.result
         setStock(uti)
         setData({
            ID_ART: uti.ID_ART ?? "",
            QUANTITE_ENTR: uti.QUANTITE_ENTR ?? "",
            QUANTITE_SORT: uti.QUANTITE_SORT ?? "",
         })
      } catch (error) {
         console.log(error)
      } finally {
         setLoadingStock(false)
      }
   }, [idStock, setData])

   useEffect(() => {
      dispatch(
         setBreadCrumbItemsAction([
            stocks_routes_items.stocks,
            stocks_routes_items.edit_stocks,
         ]),
      )
      return () => {
         dispatch(setBreadCrumbItemsAction([]))
      }
   }, [])

   useEffect(() => {
      fetchStock()
   }, [fetchStock])

   useEffect(() => {
      const fetchProfils = async () => {
         try {
            const res = await fetchApi("/profils")
            setProfils(res)
         } catch (error) {
            console.log(error)
         }
      }
      fetchProfils()
   }, [])

   useEffect(() => {
      if (data.IMAGE) {
         checkFieldData({ target: { name: "IMAGE" } })
      }
   }, [data.IMAGE])

   // Fetch articles from API
   useEffect(() => {
      const fetchArticles = async () => {
         try {
            const res = await fetchApi("/articles")
            setArticles(res.result || res) // Adjust according to your API response structure
         } catch (error) {
            console.log(error)
         }
      }
      fetchArticles()
   }, [])

   if (loadingStock) {
      return (
         <div className="d-flex justify-content-center align-items-center h-100 w-100">
            <div className="spinner-border" role="status" />
         </div>
      )
   }

   return (
      <>
         {isSubmitting ? <Loading /> : null}
         <div className="px-4 py-3 main_content bg-white has_footer">
        <div>
          <h1 className="mb-3">Ajouter au stock</h1>
          <hr className="w-100" />
        </div>
        <form className="form w-75 mt-5" onSubmit={handleSubmit}>
          {/* ID_ART Field */}
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="id_article" className="label mb-1">
                  Article
                </label>
              </div>
              <div className="col-sm">
                <Dropdown
                  id="id_article"
                  name="ID_ART"
                  value={data.ID_ART}
                  options={articles}
                  optionLabel="DESCRIPTION"
                  optionValue="ID_ART"
                  placeholder="Sélectionner un article"
                  onChange={handleChange}
                  onBlur={() => checkFieldData({ target: { name: "ID_ART", value: data.ID_ART } })}
                  className={`w-100 is-invalid ${hasError("ID_ART") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("ID_ART") ? getError("ID_ART") : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="QUANTITE_ENTR" className="label mb-1">
                  QUANTITE ENTREE
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  autoFocus
                  type="text"
                  placeholder="Entrer la quantité"
                  id="QUANTITE_ENTR"
                  name="QUANTITE_ENTR"
                  value={data.QUANTITE_ENTR}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("QUANTITE_ENTR") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("QUANTITE_ENTR") ? getError("QUANTITE_ENTR") : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group col-sm mt-5">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="QUANTITE_SORT" className="label mb-1">
                 QUANTITE SORTIE
                </label>
              </div>
              <div className="col-sm">
                <InputText
                  type="text"
                  placeholder="Ecrire le QUANTITE_SORT"
                  id="QUANTITE_SORT"
                  name="QUANTITE_SORT"
                  value={data.QUANTITE_SORT}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 is-invalid ${hasError("QUANTITE_SORT") ? "p-invalid" : ""}`}
                />
                <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                  {hasError("QUANTITE_SORT") ? getError("QUANTITE_SORT") : ""}
                </div>
              </div>
            </div>
          </div>
         
          <div
            style={{ position: "absolute", bottom: 0, right: 0 }}
            className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white"
          >
                  <Button
                     label="Annuler"
                     type="reset"
                     outlined
                     className="mt-3"
                     size="small"
                     onClick={() => {
                        navigate("/stocks")
                     }}
                  />
                  <Button
                     label="Modifier"
                     type="submit"
                     className="mt-3 ml-3"
                     size="small"
                     disabled={!isValidate() || isSubmitting}
                  />
               </div>
            </form>
         </div>
      </>
   )
}