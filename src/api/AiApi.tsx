import apiWrapper from "./apiWrapper.tsx";
import Constants from "../constants/Constants.tsx";


export default async function FetchQuestions(data: object) {
    try{
        // console.log("in fetch questions");
        const res = await apiWrapper(Constants.apiendpoint,{
            method:"POST",
            headers: {
                'Content-Type':'application/json',
                Authorization: Constants.token,
            },
            body: JSON.stringify(data)
        });

        return res;

    }catch(e){
        console.error("An error occure in fetchQuestions",e);
    }   
    
}