export interface DashboardCardUiProps {
    title: string
    value: string
    icon: string
    backgroundColor: string
    percentage: number
    period: string
}

export interface RevenueCardUiProps {
    title: string
    value: string
    currency: string
    percentage_before: number
    percentage_after: number
    period: string
}