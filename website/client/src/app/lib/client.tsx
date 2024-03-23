import useSWR from "swr"

async function fetcher(url) {
    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_ROOT}${url}`, { method: "GET", cache: "no-store" }).then(x => x.json())
        return resp
    } catch (error) {
        console.error("Error with request")
        return null
    }
}

export function useGraphSummary() {
    return useSWR("/ps/summary", fetcher)
}