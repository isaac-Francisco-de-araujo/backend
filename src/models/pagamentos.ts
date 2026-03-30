export interface pagamento {
    id?: number;
    id_pedido: number;
    valor: number;
    data_pagamento: Date;
    metodo_pagamento: string;
    status: string;
}