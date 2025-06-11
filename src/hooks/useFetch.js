/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import fetchApi from "../helpers/fetchApi"

/**
 * le hook pour récuperer les données lorsque le component monte
 * @param {string} url l'url à appeler (GET)
 * @returns {Array} un tableau contenant [les donnes, le loading, le setDonnes]
 */
const initialOptions = {
   cacheData: false,
   checkInCacheFirst: false,
}
export default function useFetch(url, options = initialOptions) {
   const [state, setState] = useState({
      loading: true,
      items: [],
   })
   useEffect(() => {
      const getData = async () => {
         try {
            const data = await fetchApi(url, options)
            setState({
               loading: false,
               items: data,
            })
         } catch (error) {
            setState({
               loading: false,
               items: [],
            })
         }
      }
      getData()
   }, [url])
   return [state.loading, state.items, setState]
}
