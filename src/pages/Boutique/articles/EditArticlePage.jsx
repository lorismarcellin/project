/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Loading from "../../../components/app/Loading"
import fetchApi from "../../../helpers/fetchApi"
import { useForm } from "../../../hooks/useForm"
import { useFormErrorsHandle } from "../../../hooks/useFormErrorsHandle"
import { setBreadCrumbItemsAction, setToastAction } from "../../../store/actions/appActions"
import { FileUpload } from "primereact/fileupload"
import { Image } from "primereact/image"
import { useIntl, FormattedMessage } from "react-intl"

// formulaire à modifier
const initialForm = {
   DESCRIPTION: "",
   IMAGE: null,
}

const EditArticlePage = () => {
   const dispacth = useDispatch()
   const [data, handleChange, setData, setValue] = useForm(initialForm)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const navigate = useNavigate()
   const { ID_ARTICLE } = useParams()
   const intl = useIntl()

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

   // fonction qu'on appelle pour faire la modification
   const handleSubmit = async (e) => {
      try {
         e.preventDefault()
         if (!isValidate()) return false
         setIsSubmitting(true)
         const form = new FormData()
         form.append("DESCRIPTION", data.DESCRIPTION)
         form.append("IMAGE", data.IMAGE)

         await fetchApi(`/articles/${ID_ARTICLE}`, {
            method: "PUT",
            body: form,
         })

         dispacth(
            setToastAction({
               severity: "success",
               summary: intl.formatMessage({ id: "editArticle.toast.success.summary", defaultMessage: "Article saved" }),
               detail: intl.formatMessage({ id: "editArticle.toast.success.detail", defaultMessage: "The article has been saved successfully" }),
               life: 5000,
            }),
         )
         navigate("/articles")
      } catch (error) {
         console.log(error)
         if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
            setErrors(error.result)
         } else {
            dispacth(
               setToastAction({
                  severity: "error",
                  summary: intl.formatMessage({ id: "editArticle.toast.error.summary", defaultMessage: "System error" }),
                  detail: intl.formatMessage({ id: "editArticle.toast.error.detail", defaultMessage: "System error, please try again later" }),
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

   // pour recuperer l'objet de l'article actuel
   useEffect(() => {
      const getData = async () => {
         try {
            const res = await fetchApi(`/article/get/${ID_ARTICLE}`)
            const uti = res.result
            setData({
               DESCRIPTION: uti.DESCRIPTION,
               IMAGE: uti?.IMAGE,
            })
         } catch (error) {
            console.log(error)
         }
      }
      getData()
   }, [])

   // pour le chargement de l'image choisie
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
               <h1 className="mb-3">
                  <FormattedMessage id="editArticle.title" defaultMessage="Edit Article" />
               </h1>
               <hr className="w-100" />
            </div>
            <form className="form w-75 mt-5" onSubmit={handleSubmit}>
               {/* DESCRIPTION */}
               <div className="form-group col-sm">
                  <div className="row">
                     <div className="col-md-4">
                        <label htmlFor="DESCRIPTION" className="label mb-1">
                           <FormattedMessage id="editArticle.description.label" defaultMessage="Description" />
                        </label>
                     </div>
                     <div className="col-sm">
                        <InputText
                           autoFocus
                           type="text"
                           placeholder={intl.formatMessage({ id: "editArticle.description.placeholder", defaultMessage: "Description" })}
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
                           <FormattedMessage id="editArticle.image.label" defaultMessage="Article image" />
                        </label>
                     </div>
                     <div className="col-sm">
                        <div className="w-max mb-2">
                           <Image
                              src={data?.IMAGE}
                              alt={intl.formatMessage({ id: "editArticle.image.alt", defaultMessage: "Image" })}
                              className="rounded"
                              imageClassName="rounded "
                              width="100"
                              height="100"
                              imageStyle={{ objectFit: "cover" }}
                              preview
                           />
                        </div>
                        <FileUpload
                           chooseLabel={intl.formatMessage({ id: "editArticle.image.chooseLabel", defaultMessage: "Choose an image" })}
                           cancelLabel={intl.formatMessage({ id: "editArticle.image.cancelLabel", defaultMessage: "Cancel" })}
                           name="IMAGE"
                           uploadOptions={{
                              style: { display: "none" },
                           }}
                           className={hasError("IMAGE") ? "p-invalid" : ""}
                           accept="image/*"
                           maxFileSize={2000000}
                           invalidFileSizeMessageDetail={intl.formatMessage({ id: "editArticle.image.invalidFileSize", defaultMessage: "Image too large (max: 2MB)" })}
                           emptyTemplate={<p className="m-0">{intl.formatMessage({ id: "editArticle.image.emptyTemplate", defaultMessage: "Drag and drop your image here" })}</p>}
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
                     label={intl.formatMessage({ id: "editArticle.reset", defaultMessage: "Reset" })}
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
                     label={intl.formatMessage({ id: "editArticle.submit", defaultMessage: "Submit" })}
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

export default EditArticlePage