// import useSWR from "swr"
// import { unstable_noStore as noStore } from 'next/cache'

// async function fetcher(url: string, endpoint: string | undefined) {
//     noStore()
//     if (endpoint === undefined) {
//         console.error(`Endpoint undefined: ${endpoint}${url}`)
//         return null
//     }
//     try {
//         const resp = await fetch(`${endpoint}${url}`, { method: "GET", cache: "no-store" }).then(x => x.json())
//         return JSON.parse(resp.pjson)
//     } catch (error) {
//         console.error("Error with request")
//         return null
//     }
// }

// export function useGraphSummary(endpoint: string | undefined) {
//     noStore()
//     console.log(`Inside: ${endpoint}`)
//     const { data, error, isLoading } = useSWR(["/ps/summary", endpoint], ([url, endpoint]) => fetcher(url, endpoint))
//     return {
//         graph: data,
//         error: error,
//         isLoading: isLoading
//     }
// }