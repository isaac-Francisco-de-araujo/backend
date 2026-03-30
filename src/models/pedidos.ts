export interface pedidos {
    id?: number;
    id_cliente: number;
    valor_total: number;
    data_pedido: Date;
    status: string;
}