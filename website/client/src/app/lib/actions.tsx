import useSWR from "swr"

const getter = (url) => fetch(`${process.env.ENDPOINT_ROOT}${url}`, { method: "GET" }).then(x => x.json())

function useGraph(id) {
    const { data, error, isLoading } = useSWR(`/ps/graphs/${id}`, getter)
    return {
        graph: data.pjson,
        isLoading,
        isError: error
    }
}