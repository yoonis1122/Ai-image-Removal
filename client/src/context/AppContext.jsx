import { createContext } from "react";
import { useState, useEffect } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AppContext = createContext()

export { AppContext } // ✅ THIS IS THE FIX

const AppContextProvider = (props) => {

    const [credit, setCredit] = useState(false)
    const [image, setImage] = useState(false)
    const [resultImage, setResultImage] = useState(false)




    const backend_url = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()
    const {getToken} = useAuth()
    const {isSignedIn} = useUser()




    const {openSignIn} = useClerk()

    const loadCreditsData = async () => {
try {
    const token = await getToken();
    const {data} = await axios.get(backend_url + "/api/user/credits", {headers: {token}}) // ✅ space fix
        if(data.success){
            setCredit(data.credits)
           
        }
    
} catch (error) {
    console.log(error.message);
    toast.error(error.message)
}
    }

    
   
    const removeBg = async (image) => {
        try {
           if(!isSignedIn){
            return openSignIn()
           }
            setImage(image)
            setResultImage(false)
            navigate("/result")

            const token = await getToken()

            const formData = new FormData()

            image && formData.append("image", image)

            const {data} = await axios.post(backend_url + "/api/image/remove-bg", formData, {headers: {token}})

            if(data.success){
                setResultImage(data.resultImage)
               if(data.creditBalance !== undefined) setCredit(data.creditBalance)
            }
            else{
                toast.error(data.message)
                if(data.creditBalance !== undefined) setCredit(data.creditBalance)
                if(data.creditBalance === 0){
                    navigate("/buy")
                }
            }

        } catch (error) {
            console.log(error.message);
    toast.error(error.message)
            
        }
    }

const value = {
credit,
loadCreditsData, // ✅ duplicate removed
backend_url,
image,setImage,
removeBg,
resultImage, setResultImage
}

return(
    <AppContext.Provider value={value}>
{props.children}
    </AppContext.Provider>
)
}

export default AppContextProvider