export const useLogRefresh = () => {
    const refreshTrigger = useState('log-refresh-trigger', () => 0)

    const triggerRefresh = () => {
        refreshTrigger.value++
    }

    return {
        refreshTrigger: readonly(refreshTrigger),
        triggerRefresh
    }
}
