import {useCallback, useContext, useEffect, useState} from "react";
import {DEFAULT_PAGE, DEFAULT_PAGE_SIZE} from "../model/common";
import {AppContext} from "../routes/Root";

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


const formatTokenCount = (count: number) => {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(2)}M`;
    } else if (count >= 1000) {
        return `${(count / 1000).toFixed(2)}k`;
    }
    return count.toString();
}

export const useTokenCount = () => {
    const applicationContext = useApplicationContext();
    const [tokenCount, setTokenCount] = useState<string>();
    const [currentPlanTokenCount, setCurrentPlanTokenCount] = useState<string>();

    useEffect(() => {
        const currentPlanTokenCount = applicationContext.configuration.subscriptionPlans
            .find(plan => plan.type === applicationContext.customer.subscription.plan)
            ?.tokenCount;
        const currentPlanTokenCountFormatted = formatTokenCount(currentPlanTokenCount ?? 0);

        const tokenCount = applicationContext.customer.subscription.tokenCount;
        const tokenCountFormatted = formatTokenCount(tokenCount);

        setCurrentPlanTokenCount(currentPlanTokenCountFormatted);
        setTokenCount(tokenCountFormatted);
    }, [applicationContext]);

    return {tokenCount, currentPlanTokenCount, counter: `${tokenCount} / ${currentPlanTokenCount}`};
};

export const useApplicationContext = () => {
    const applicationContext = useContext(AppContext);
    if (!applicationContext) {
        throw new Error("useApplicationContext must be used within an AppProvider");
    }

    return applicationContext;
}

const useDialog = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = () => setIsOpen(true);
    const closeDialog = useCallback(() => setIsOpen(false), []);

    return {
        isOpen,
        openDialog,
        closeDialog
    };
};

export default useDialog;