import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import fetchApi from "../../helpers/fetchApi";
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import { setToastAction } from "../../store/actions/appActions";
import { useDispatch } from "react-redux";

const initialForm = {
   NUMERO: "",
};

export default function NewClassePage() {
   const dispatch = useDispatch();
   const [data, handleChange] = useForm(initialForm);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const navigate = useNavigate();

   const { hasError, getError, setErrors, checkFieldData, isValidate } = useFormErrorsHandle(data, {
      NUMERO: {
         required: true,
         alpha_num: true,
         length: [1, 20],
      },
   });

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!isValidate()) return;

      setIsSubmitting(true);
      try {
         await fetchApi("/classes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
         });

         dispatch(
            setToastAction({
               severity: "success",
               summary: "Classe ajoutée",
               detail: "La classe a été ajoutée avec succès.",
               life: 3000,
            })
         );
         navigate("/classes");
      } catch (error) {
         if (error.httpStatus === "UNPROCESSABLE_ENTITY") {
            setErrors(error.result);
         } else {
            dispatch(
               setToastAction({
                  severity: "error",
                  summary: "Erreur",
                  detail: "Erreur lors de l'ajout. Réessayez plus tard.",
                  life: 3000,
               })
            );
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="main_content px-4 py-3">
         <h3>Nouvelle Classe</h3>
         <form className="form mt-4" onSubmit={handleSubmit}>
            <div className="form-group">
               <label htmlFor="numero">Numéro</label>
               <InputText
                  id="numero"
                  name="NUMERO"
                  value={data.NUMERO}
                  onChange={handleChange}
                  onBlur={checkFieldData}
                  className={`w-100 ${hasError("NUMERO") ? "p-invalid" : ""}`}
               />
               {hasError("NUMERO") && <small className="p-error">{getError("NUMERO")}</small>}
            </div>
            <div className="mt-3 d-flex justify-content-end">
               <Button
                  label="Annuler"
                  type="button"
                  outlined
                  onClick={() => navigate("/classes")}
                  className="mr-2"
               />
               <Button
                  label="Ajouter"
                  type="submit"
                  disabled={!isValidate() || isSubmitting}
               />
            </div>
         </form>
      </div>
   );
}