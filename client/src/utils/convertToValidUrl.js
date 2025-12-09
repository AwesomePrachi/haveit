export const convertToValidUrl = (name)=>{
    const url = name?.toString().replaceAll(" ","-").replaceAll(",","-").replaceAll("&","-")
    return url
}