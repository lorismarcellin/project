import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import fetchApi from "../../helpers/fetchApi"
import { useForm } from "../../hooks/useForm"
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle"
import Loading from "../../components/app/Loading"

const initialForm = {
   NOM: "",
}

export default function NewCampusPage() {
   const [data, handleChange] = useForm(initialForm)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const navigate = useNavigate()

   const { hasError, getError, isValidate, checkFieldData, setErrors } = useFormErrorsHandle(data, {
      NOM: { required: true, alpha: true, length: [2, 100] },
   })

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!isValidate()) return
      setIsSubmitting(true)
      try {
         await fetchApi("/campus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
         })
         navigate("/campus")
      } catch (err) {
         if (err.httpStatus === "UNPROCESSABLE_ENTITY") {
            setErrors(err.result)
         }
      } finally {
         setIsSubmitting(false)
      }
   }

   return (
      <>
         {isSubmitting && <Loading />}
         <div className="main_content bg-white p-4 has_footer">
            <h2 className="mb-3">Nouveau Campus</h2>
            <form onSubmit={handleSubmit} className="form w-75">
               <div className="form-group">
                  <label htmlFor="nom" className="label">Nom</label>
                  <InputText
                     id="nom"
                     name="NOM"
                     value={data.NOM}
                     onChange={handleChange}
                     onBlur={checkFieldData}
                     className={`w-100 ${hasError("NOM") ? "p-invalid" : ""}`}
                  />
                  {hasError("NOM") && (
                     <div className="invalid-feedback">{getError("NOM")}</div>
                  )}
               </div>
               <div className="d-flex justify-content-end mt-3">
                  <Button type="button" label="Annuler" className="mr-2" outlined onClick={() => navigate("/campus")} />
                  <Button type="submit" label="Enregistrer" disabled={!isValidate() || isSubmitting} />
               </div>
            </form>
         </div>
      </>
   )
}