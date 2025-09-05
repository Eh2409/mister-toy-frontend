import { useEffect, useState } from 'react'

const confirmationMessage = 'You have unsaved changes. Continue?'

export function useConfirmTabClose() {

    const [isUnsafeTabClose, setIsUnsafeTabClose] = useState(false)

    useEffect(() => {
        function handleBeforeUnload(ev) {
            if (isUnsafeTabClose) {
                ev.returnValue = confirmationMessage
                return confirmationMessage
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [isUnsafeTabClose])

    return setIsUnsafeTabClose
}