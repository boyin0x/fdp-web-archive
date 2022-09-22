import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { BatchId } from "@ethersphere/bee-js";
import { FdpStorage } from "@fairdatasociety/fdp-storage";
import { getSearchableContentCache, getPageTitle, getEnsConfig, setStorageUserData, getStorageUserData } from "./utils";


const POD_NAME = "fdp-web-archive";
const PAGES_DIRECTORY = "/pages";

const fdp = new FdpStorage(
  process.env.REACT_APP_BEE_URL as string,
  // process.env.REACT_APP_BEE_DEBUG_URL as string,
  process.env.REACT_APP_BEE_BATCH_ID as BatchId,
  getEnsConfig()
);

/**
 * initialize the extension pod if not exist
 */
export function fdpInitializeAccount() {
  let initialize = async () => {
    await refreshAccount();
    const pods = await fdp.personalStorage.list();
    let pod = pods.getPods().filter((p) => p.name === POD_NAME)[0];
    console.log("Loaded Pod...", pod);
    if (!pod) {
      console.log("Creating pod...", POD_NAME);
      pod = await fdp.personalStorage.create(POD_NAME);
      console.log("creating dir...", PAGES_DIRECTORY);
      await fdp.directory.create(POD_NAME, PAGES_DIRECTORY);
    }
  };
  return new Promise<void>((resolve, reject) => {
    initialize().then(resolve).catch(reject);
  });
}

/**
 * refresh user account
 */
async function refreshAccount() {
  let username  = await getStorageUserData("username") ?? ""
  let password  = await getStorageUserData("password") ?? ""
  console.log("refreshAccount:", username);
  await fdp.account.login(username, password);
}

/**
 * Perform login to fdp
 */
export function fdpLogin(arg: { username: string; password: string }) {
  // console.log("fdplogin: ", arg)
  return new Promise<{ data: string }>((resolve, reject) => {
    fdp.account.login(arg.username, arg.password).then(a => {
      if (a) {
        resolve({ data: arg.username })
      } else
        reject("Login Error")
    }).catch(e => reject(e));
  })
}

/**
 * Download file from fdp
 */
 export async function fdpDownloadFile(fileName: string) {
    await refreshAccount()
    console.log("fdpDownloadFile", fileName)
    let data = await fdp.file.downloadData(
        POD_NAME,
        PAGES_DIRECTORY + "/" + fileName
    );
    return data
}

export const api = createApi({
  baseQuery: fakeBaseQuery(),
  reducerPath: "api",
  tagTypes: ['PAGES'],
  endpoints: (builder) => ({

    searchPages: builder.query<string[], {search:string, pageNames:string[]}>({
      async queryFn(args,{dispatch}) {
        try {
          
          if (args.search.length ===0) {
            return {data: args.pageNames}
          }
          
          let result = args.pageNames.filter(n=> n && getPageTitle(n).toLowerCase().indexOf(args.search) !== -1)
          let cachedPages = await getSearchableContentCache()
          let cachedResult = cachedPages.filter(p=>
            (p.fileName && args.pageNames.includes(p.fileName)) && (
            (p.title && p.title?.toLowerCase().indexOf(args.search) !== -1) || 
            (p.url && p.url?.toLowerCase().indexOf(args.search) !== -1)  ||
            (p.text && p.text?.toLowerCase().indexOf(args.search) !== -1)
            )
          ).map(p=>p.fileName)
          // console.log({result, cachedResult, cachedPages})
          let searchResult = new Set([...result, ...cachedResult]) as Set<string>
          return {data: Array.from(searchResult)}
        } catch (e) {
          console.log("ERROR", e);
          return { error: e };
        }
      },
    }),
    

    // reads the PAGES_DIRECTORY files
    getPageNames: builder.query<string[], {}>({

      async queryFn(args,{dispatch}) {
        try {
          
          // todo: remove / comment this
          // let localPages = await getStorageUserData("localPages")  
          // let loacalPagesArr = JSON.parse(localPages || "[]")
          // console.log({loacalPagesArr});
          // if (loacalPagesArr as string[] && loacalPagesArr.length > 0)  {
          //   return {data:loacalPagesArr}
          // }

          await refreshAccount();
          console.log("getPageNames...");

          let dir = await fdp.directory.read(POD_NAME, PAGES_DIRECTORY);
          
          console.log("getPageNames DONE...", dir);
          let p = dir.content.map((d) => d.name) as string[];

          // todo: remove / comment this
          setStorageUserData("localPages", JSON.stringify(p))

          return { data: p }; 
        } catch (e) {
          
          console.log("ERROR", e);
          return { error: e };
        }
      },
      providesTags: ['PAGES']
    }),



    // uploads a page metadata and its pdf representation
    storeFile: builder.mutation<string, { fileName: string; content: Buffer }>({

      queryFn: async ( args ) => {
        try {
          
          await refreshAccount();

          await fdp.file.uploadData(
            POD_NAME,
            PAGES_DIRECTORY + "/" + args.fileName,
            args.content
          );
          
          console.log("storedPage", "pdf", args.fileName);
          
          return { data: args.fileName };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ['PAGES'],
    }),

    

    deleteFile: builder.mutation<string, { fileName: string }>({
      async queryFn(args,{dispatch}) {
        try {
          
          await refreshAccount();
          await fdp.file.delete(
            POD_NAME,
            PAGES_DIRECTORY + "/" + args.fileName
          );
          
          console.log("deleteFile...DONE", args.fileName);

          return { data: args.fileName };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ['PAGES'],
    }),

    shareFile: builder.mutation<string, { fileName: string }>({
      async queryFn(args,{dispatch}) {
        try {
          
          await refreshAccount();
          let ref = await fdp.file.share(
            POD_NAME,
            PAGES_DIRECTORY + "/" + args.fileName
          );
          
          console.log("shareFile...DONE", args.fileName);

          return { data: ref };
        } catch (e) {
          return { error: e };
        }
      },
    }),


    importSharedFile: builder.mutation<string, { reference: string }>({
      async queryFn(args,{dispatch}) {
        try {
          
          
          await refreshAccount();

          let sharedInfo = await fdp.file.getSharedInfo(args.reference)
          console.log(sharedInfo)
          let fileName = sharedInfo.meta.file_name
          console.log(sharedInfo.meta)
          console.log(fileName)

          await fdp.file.saveShared(
            POD_NAME,
            PAGES_DIRECTORY,
            args.reference
          );
          
          console.log("importSharedFile...DONE", args.reference);

          return {data:args.reference}

        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ['PAGES'],
    }),






  }),
});

export const { 
  useShareFileMutation,
  useDeleteFileMutation,
  useLazySearchPagesQuery,
  useImportSharedFileMutation,
  useGetPageNamesQuery,
  useStoreFileMutation
 } = api


