import apiWrapper from "./apiWrapper.tsx";
import Constants from "../constants/Constants.tsx";


export default async function FetchQuestions(data: object) {

    try{
        function encrypt(text) {
          return btoa(text);
        }
        
        function decrypt(encryptedText) {
          return atob(encryptedText);
        }

        const Token = decrypt(Constants.token);
        const apiurl = decrypt(Constants.apiendpoint);
        const model = decrypt(Constants.model);
        // console.log("in fetch questions");
        const res = await apiWrapper(apiurl,{
            method:"POST",
            headers: {
                'Content-Type':'application/json',
                Authorization: Token,
            },
            body: JSON.stringify(data)
        });

        return res;

    }catch(e){
        console.error("An error occure in fetchQuestions",e);
    }   
    
}