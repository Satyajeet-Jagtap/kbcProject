//  import Constants from "../constants/Constants.tsx";
 
 const apiWrapper = async (url, options : RequestInit = {})=>{
    //here you can get the token from localStorage
    // const token = Constants.token;
    // options.headers={
    // ...(options.headers || {}),
    // Authorization : `Bearer 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`,
    // };

    try{
        const response = await fetch(url,options)

        if(response.status === 401){
            console.log("Unauthorize access");
            //you can throw an error from here and also i you wnat to redirect to any page.
        }
        if(!response.ok){
            console.log("something went wrong");
        }
        // console.log("response is in wrapper "+ response);
        const handleData = await convertResp(response);
        // console.log("handledata is in wrapper "+ JSON.stringify(handleData));
        return handleData;
    }catch(e){
        console.error("Global fetch error : ", e);
        throw e;
    }
};  

export default apiWrapper;

async function convertResp(res){
    const contentType=res.headers.get("Content-Type");

    // const text = await res.text();
    
    // if (!text.trim()) {
    //     console.warn("⚠️ API returned empty response!");
    //     return null;
    // }
    

    // const json = JSON.parse(text);
    // console.log(json);
    // return json;

// console.log("json response:", json);
    // console.log(contentType);
    if(contentType?.includes("text/plain")){
        // console.log("in text/plain");
        return await res.text();
    }else if(contentType?.includes("application/json")){
        // console.log("in application/json");
        return await res.json();
    }else{
        // console.log("in else apiwrapper");
        return await res.json();
    }
}

