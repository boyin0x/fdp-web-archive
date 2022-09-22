
import AdmZip from "adm-zip"
import chromeHelper from "../chromeHelper";
import { Page } from "./types";

export async function createZip(name: string, str: string, pdf: string): Promise<Buffer> {

  var zip = new AdmZip()

  const resp = await fetch(pdf)
  const blob = await resp.blob();
  const array = await blob.arrayBuffer()

  zip.addFile(name + ".pdf", Buffer.from(array), "comment")
  zip.addFile(name + ".json", Buffer.from(str), "comment")

  var buffer = zip.toBuffer()

  return buffer
}

export async function getSearchableContentCache() : Promise<Page[]> {
  let searchMetadata = await getStorageUserData("searchMetadata") 
  let searchMetadataArray = JSON.parse(searchMetadata || "[]") as Page[]
  return searchMetadataArray
}

export async function setStorageUserData(key:string, value:string) {
  
  if (["username", "password"].indexOf(key.toLowerCase()) !== -1) {
    let kv : {[k:string]:string} = {}
    kv[key] = value
    await chromeHelper.storage.local.set(kv)
    return
  }
  let {username} = await chromeHelper.storage.local.get("username")
  if (username as string && username.length > 0) {
    let kv : {[k:string]:string} = {}
    kv[username + "_" + key] = value
    await chromeHelper.storage.local.set(kv)
  } 
}

export async function getStorageUserData(key:string)  {
  if (["username", "password"].indexOf(key.toLowerCase()) !== -1) {
    let obj = await chromeHelper.storage.local.get(key)
    return obj[key] as string
  }
  let {username} = await chromeHelper.storage.local.get("username")
  if (username as string && username.length > 0) {
    let k = username+"_"+key
    let v = await chromeHelper.storage.local.get(k)
    return v[k] as string
  }
  return null
}

export async function refreshSearchableContentCache(page:Page) {
  let {text, title,url, fileName} = page 
  let pdf = ""
  
  let searchMetadata = await getStorageUserData("searchMetadata") 
  let searchMetadataArray = JSON.parse(searchMetadata || "[]") as Page[]
  searchMetadataArray.push({text, title, url, pdf, fileName})
  
  await setStorageUserData("searchMetadata", JSON.stringify(searchMetadataArray))
}

export function removeFileExtension(rawName: string) : string {
  if (rawName.toLowerCase().endsWith(".zip")) {
    return rawName.substring(0, rawName.length - 4)
  } else {
    return rawName
  }
}

export function getPageTitle(rawName: string) : string {
  let encodedName = removeFileExtension(rawName)
  let title = titleFromPageName(encodedName)
  return title.length === 0 ? rawName : title
}

export function urlFromPageName(pageName: string) {
  let jsonNameStr = decodeURIComponent(pageName)
  let jsonName = JSON.parse(jsonNameStr) as {t:string, u:string}
  return jsonName && jsonName.u.length > 0 ? jsonName.u : ""
}

export function titleFromPageName(pageName: string) :string{
  let jsonNameStr = decodeURIComponent(pageName)
  let jsonName = JSON.parse(jsonNameStr)  as {t:string, u:string}
  return jsonName && jsonName.t.length > 0 ? jsonName.t : ""
}

export function createFileName(title: string, url: string, text:string) {
  let jsonName = JSON.stringify({t:title, u:url})
  let fileName = encodeURIComponent(jsonName)
  return fileName 
}

export function getEnsConfig(): any {
  const ensRegistry = process.env.REACT_APP_ENS_REGISTRY_ADDRESS;
  const publicResolver = process.env.REACT_APP_PUBLIC_RESOLVER_ADDRESS;
  const fdsRegistrar = process.env.REACT_APP_SUBDOMAIN_REGISTRAR_ADDRESS;

  if (ensRegistry && publicResolver && fdsRegistrar) {
    return {
      ensOptions: {
        performChecks: true,
        rpcUrl: process.env.REACT_APP_RPC_URL,
        contractAddresses: {
          ensRegistry,
          publicResolver,
          fdsRegistrar,
        },
      },
      //   ensDomain: "fds",
    };
  }

  return undefined;
}