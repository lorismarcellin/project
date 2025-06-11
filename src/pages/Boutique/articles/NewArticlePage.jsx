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
import { FileUpload } from "primereact/fileupload"

// formulaire à soumettre
const initialForm = {
   DESCRIPTION: "",
   IMAGE: null,
}

const AddArticlesPage = () => {
   const dispacth = useDispatch()
   const [data, handleChange, setData, setValue] = useForm(initialForm)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const navigate = useNavigate()

   // pour la gestion du formulaire
   const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
      DESCRIPTION: {
         required: true,
         alpha: true,
         length: [2, 20],
      },
      IMAGE: {
         required: true,
      },
   })

   const handleSubmit = async (e) => {
      try {
         e.preventDefault()
         if (!isValidate()) return false
         setIsSubmitting(true)
         const form = new FormData()
         form.append("DESCRIPTION", data.DESCRIPTION)
         form.append("IMAGE", data.IMAGE)

         await fetchApi("/articles", {
            method: "POST",
            body: form,
         })

         dispacth(
            setToastAction({
               severity: "success",
               summary: "Article enregistré",
               detail: "L'article a été enregistré avec succès",
               life: 5000,
            }),
         )
         navigate("/article")
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

   useEffect(() => {
      if (data.IMAGE) {
         checkFieldData({ target: { name: "IMAGE" } })
      }
   }, [data.IMAGE])

   return (
      <>
         {isSubmitting ? <Loading /> : null}
         <div className="px-4 py-3 main_content bg-white has_footer">
            <div className="">
               <h1 className="mb-3">Nouvel article</h1>
               <hr className="w-100" />
            </div>
            <form className="form w-75 mt-5" onSubmit={handleSubmit}>
               {/* DESCRIPTION */}
               <div className="form-group col-sm">
                  <div className="row">
                     <div className="col-md-4">
                        <label htmlFor="DESCRIPTION" className="label mb-1">
                           Description
                        </label>
                     </div>
                     <div className="col-sm">
                        <InputText
                           autoFocus
                           type="text"
                           placeholder="Description"
                           id="DESCRIPTION"
                           name="DESCRIPTION"
                           value={data.DESCRIPTION}
                           onChange={handleChange}
                           onBlur={checkFieldData}
                           className={`w-100 is-invalid ${hasError("DESCRIPTION") ? "p-invalid" : ""}`}
                        />
                        <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                           {hasError("DESCRIPTION") ? getError("DESCRIPTION") : ""}
                        </div>
                     </div>
                  </div>
               </div>
               {/* IMAGE */}
               <div className="form-group col-sm mt-5">
                  <div className="row">
                     <div className="col-md-4">
                        <label htmlFor="IMAGE" className="label mb-1">
                           Image article
                        </label>
                     </div>
                     <div className="col-sm">
                        <FileUpload
                           chooseLabel="Choisir une image"
                           cancelLabel="Annuler"
                           name="IMAGE"
                           uploadOptions={{
                              style: { display: "none" },
                           }}
                           className="p-invalid"
                           accept="image/*"
                           maxFileSize={2000000}
                           invalidFileSizeMessageDetail="Image trop lourde(max: 2Mo)"
                           emptyTemplate={<p className="m-0">Drag and drop your image here</p>}
                           onSelect={async (e) => {
                              const file = e.files[0]
                              setValue("IMAGE", file)
                           }}
                           onClear={() => {
                              setError("IMAGE", {})
                           }}
                        />
                        <div className="invalid-feedback" style={{ minHeight: 21, display: "block" }}>
                           {hasError("IMAGE") ? getError("IMAGE") : ""}
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

export default AddArticlesPage