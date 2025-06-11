import { ApiException } from './types';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

export function useHandleError() {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    return (action: string, error: ApiException | Error | unknown) => {
        console.error(error);

        let message = 'apiError.unexpectedError';
        if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
            message = t((error as any).message);
        }

        enqueueSnackbar(`${t(action)} ${t(message)}`, { variant: 'error', autoHideDuration: 5000 });
    };
}