/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Loading from "../../../components/app/Loading"
import fetchApi from "../../../helpers/fetchApi"
import { useForm } from "../../../hooks/useForm"
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle"
import { setBreadCrumbItemsAction, setToastAction } from "../../../store/actions/appActions"

// formulaire à soumettre
const initialForm = {
   DESIGNATION: "",
}

const AddPageCategorie = () => {
   const dispacth = useDispatch()
   const [data, handleChange, setData] = useForm(initialForm)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const navigate = useNavigate()

   // pour la gestion du formulaire
   const { hasError, getError, setErrors, checkFieldData, isValidate } = useFormErrorsHandle(data, {
      DESIGNATION: {
         required: true,
         alpha: true,
         length: [2, 20],
      },
   })

   const handleSubmit = async (e) => {
      try {
         e.preventDefault()
         if (!isValidate()) return false
         setIsSubmitting(true)
         const form = new FormData()
         form.append("DESIGNATION", data.DESIGNATION)

         await fetchApi("/category/create", {
            method: "POST",
            body: form,
         })

         dispacth(
            setToastAction({
               severity: "success",
               summary: "Catégorie enregistrée",
               detail: "La catégorie a été enregistré avec succès",
               life: 5000,
            }),
         )
         navigate("/categorie")
      } catch (error) {
         console.log(error)
         if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
            setErrors(error.result)
         } else {
            dispacth(
               setToastAction({
                  severity: "error",
                  summary: "Erreur du système",
                  detail: "Erreur du système, réessayez plus tard",
                  life: 5000,
               }),
            )
         }
      } finally {
         setIsSubmitting(false)
      }
   }

   useEffect(() => {
      dispacth(
         setBreadCrumbItemsAction([
            // administration_routes_items.utilisateurs,
            // administration_routes_items.new_utilisateurs
         ]),
      )
      return () => {
         dispacth(setBreadCrumbItemsAction([]))
      }
   }, [])

   return (
      <>
         {isSubmitting ? <Loading /> : null}
         <div className="px-4 py-3 main_content bg-white has_footer">
            <div className="">
               <h1 className="mb-3">Nouvelle catégorie</h1>
               <hr className="w-100" />
            </div>
            <form className="form w-75 mt-5" onSubmit={handleSubmit}>
               <div className="form-group col-sm">
                  <div className="row">
                     <div className="col-md-4">
                        <label htmlFor="DESIGNATION" className="label mb-1">
                           DESIGNATION
                        </label>
                     </div>
                     <div className="col-sm">
                        <InputText
                           autoFocus
                           type="text"
                           placeholder="Nom de la catégorie"
                           id="DESIGNATION"
                           name="DESIGNATION"
                           value={data.DESIGNATION}
                           onChange={handleChange}
                           onBlur={checkFieldData}
                           className={`w-100 is-invalid ${hasError("DESIGNATION") ? "p-invalid" : ""}`}
                        />
                        <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                           {hasError("DESIGNATION") ? getError("DESIGNATION") : ""}
                        </div>
                     </div>
                  </div>
               </div>
               <div
                  style={{ position: "absolute", bottom: 0, right: 0 }}
                  className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white"
               >
                  <Button
                     label="Reinitialiser"
                     type="reset"
                     outlined
                     className="mt-3"
                     size="small"
                     onClick={(e) => {
                        e.preventDefault()
                        setData(initialForm)
                        setErrors({})
                     }}
                  />
                  <Button
                     icon="pi pi-check"
                     label="Envoyer"
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

export default AddPageCategorie
