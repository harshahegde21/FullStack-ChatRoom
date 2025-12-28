
export const setUsertoLocalStorage = (user)=>{
localStorage.setItem("user",JSON.stringify(user))
}

export const  getUserFromLocalStorage = ()=>{
    return JSON.parse(localStorage.getItem("user"))
}
