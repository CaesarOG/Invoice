import { createAction } from 'typesafe-actions'


const invClickRow = createAction('@@invoicesdet/CLICK_EDIT',
    (rowData: string[], rowMeta: { dataIndex: number; rowIndex: number }) => (
        {rowData}
    )
)()




const invoiceDetActions = {
    invClickRow
}

export { invoiceDetActions as InvoicesDetAction }