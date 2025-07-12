
export const FetchSource = () => {
  // return {source:"http://localhost:8081/inventory/api/", permitSource: "http://localhost:8081/permits/api/buses"}
  return {source:"http://192.168.137.88:8081/inventory/api/", permitSource: "http://192.168.137.88:8081/permits/api/buses"}
}

export const getFetch = (url) => fetch(FetchSource().source+url).then(res=>{
  if(res.status===200){
    return res.json();
  } else if (res.status === 404){
    throw new Error("Resource Not Found")
  }
  else{
    throw new Error("An Unexpected Error Occured")
  }
})

export const deleteFetch = (url) => fetch(FetchSource().source+url,{
  method: "DELETE"
}).then(res=>{
  if(res.status===404){
    throw new Error("Item Not Found!!!")
  }
  else if(!res.ok){
    throw new Error("An Unexpected Error Occurred!!!")
  }
})

export const postFetch = (url, data) => fetch(FetchSource().source+url,{
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
}).then(res=>{
  if(!res.ok){
    throw new Error("An Error Occurred")
  }
})