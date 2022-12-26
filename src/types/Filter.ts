export interface FilterItem {
    filterName: string;
    status: StatusFilterItem;
    amount: number;
}

export enum StatusFilterItem {
    active = 'active',
    normal = 'normal',
    disabled = 'disabled',
}
