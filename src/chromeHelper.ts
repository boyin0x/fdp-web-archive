
function get(keys?: string | string[] | { [key: string]: any } | null) : Promise<{ [key: string]: any }> {
    return chrome.storage.local.get(keys)
    // let k  = keys as string
    // return new Promise(()=>{
    //     window.localStorage.getItem(k)
    //     return {k:34}
    // })
}

function remove(keys: string | string[]): Promise<void> {
    return chrome.storage.local.remove(keys)
    // let k  = keys as string
    // return new Promise(()=>{
    //     window.localStorage.removeItem(k)
    // })
}

function set(items: { [key: string]: any }): Promise<void> {
    return chrome.storage.local.set(items)
    // return new Promise(()=>{
    //     Object.keys(items).forEach(k=>{
    //         let d = items[k]
    //         window.localStorage.setItem(k,d)
    //     })    
    // })

}
// chrome.storage.local
const chromeHelper = {storage:{local: {get, set, remove}}}

// export function getBrowserInstance(): typeof chrome {
//     // Get extension api Chrome or Firefox
//     const browserInstance = window.chrome || (window as any)['browser'];
//     return browserInstance;
//   }


export default chromeHelper