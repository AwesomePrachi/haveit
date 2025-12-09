import SummaryApi from "../config/SummaryApi"
import Axios from "./Axios"

const fetchUserData = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.current_user
        })

        return response?.data

    } catch (error) {
        // console.log("fetchUserData error",error)
        return null
    }
}

export default fetchUserData