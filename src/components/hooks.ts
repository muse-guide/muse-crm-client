import {useState} from "react";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE} from "../model/common";

export function usePagination() {
    const [page, setPage] = useState<number>(DEFAULT_PAGE);
    const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
    const [keys, setKeys] = useState<(string | undefined)[]>([undefined]);

    const resetPagination = (pageSize?: number) => {
        setPage(DEFAULT_PAGE)
        setPageSize(pageSize ?? 10)
        setKeys([undefined])
    }

    const updatePageKeys = (nextPageKey: string) => {
        setKeys(prev => {
            const tmpKeys = prev
            tmpKeys[page + 1] = nextPageKey
            return tmpKeys
        })
    }

    const nextPage = () => setPage(prev => prev + 1)
    const prevPage = () => setPage(prev => prev - 1)

    const toApiPagination = () => ({
        pageSize: pageSize,
        nextPageKey: keys[page]
    })

    return {page, pageSize, keys, resetPagination, updatePageKeys, nextPage, prevPage, toApiPagination}

}