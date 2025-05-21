import axios from 'axios';
// const URL = 'http://98.70.57.33:8000';
// const URL = 'https://gatishakti-gpu.aiensured.com'
const URL = "https://gatishakti-api.aiensured.com";


export const generateText = async (fname, query) => {
    try {
      const response = await axios.get(`${URL}/dpr_query`, {
        params: {
          fname: fname,
          query: query,
          // include_evaluation: includeEvaluation,
        }
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response || error.message);
      throw error;
    }
  };

// export const generateText = async (text,fname,evaluation) => {
//     try {
//         const response = await axios.get(`${URL}/dpr_query`, {
//             params: {text,fname,evaluation}
//         });
//         console.log(response.data, "response data in api file");
//         return response.data;
//     } catch (error) {
//         console.error('Error generating text:', error);
//         throw error;
//     }
// };


export const getTemplateMatching = async (fname) => {
    try {
      const response = await axios.get(`${URL}/template_matching`, {
        params:{fname}, 
      });
      // console.log('API Response:', response.data); 
      return response.data; 
    } catch (error) {
      console.error('Error fetching template matching data:', error.response || error);
      throw error; 
    }
  };

// Rule Matching 
export const getRuleCheck = async (fname) =>{
    try {
        const response =  await axios.get(`${URL}/rule_check` ,{
            params:{fname},
        });
        // console.log('Response:', response.data);
        return response.data
    } catch (error) {
        console.error("Error fetching rule check data",error);
        throw error;
    }
}

// PPT Generation API 
export const ppt_generation = async (fname) => {
    try {
        const response = await axios.get(`${URL}/ppt_generation`, {
            params: { fname }  // Send fname as a query parameter
        });
        
        return response.data; // Return the data for further use
    } catch (error) {
        console.error("Error generating PPT:", error);
        throw error;  // Re-throw the error to handle it in the UI
    }
};


// SOR Check 

export const SorCheck = async (fname,tolerance) => {
    try {
        const response = await axios.get(`${URL}/sor_check`,{

            params:{fname,tolerance}
        })
        // console.log('Response:', response.data);

        return response.data;
    } catch (error) {
        console.error("Error Sor Check:", error);
        throw error;  // Re-throw the error to handle it in the UI
    }
};