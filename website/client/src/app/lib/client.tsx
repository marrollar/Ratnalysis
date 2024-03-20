import useSWR from "swr"

async function fetcher(url) {
    try {
        const resp = await fetch(`http://127.0.0.1:8080${url}`, { method: "GET", cache: "no-store" }).then(x => x.json())
        return resp
    } catch (error) {
        console.error("Error with request")
        return null
    }
}

export function useGraphSummary() {
    return useSWR("/ps/summary", fetcher)
}