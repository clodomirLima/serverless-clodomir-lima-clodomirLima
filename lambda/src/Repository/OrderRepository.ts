import { type IOrderRepository, type Order, type Db } from './types/IOrderRepository'

export class OrderRepository implements IOrderRepository {
  private readonly Orders: Db
  private OrderList: Order[] | undefined

  constructor (Orders: Db) {
    this.Orders = Orders
  }

  private readonly getOrder = async (): Promise<Order[]> => {
    if (this.OrderList === undefined) {
      this.OrderList = await this.Orders.Orders()
      return this.OrderList
    }
    return this.OrderList
  }

  listOrders = async (params: { userId: string, sort: string }): Promise<Order[]> => {
    const result = (await this.getOrder()).filter((item) => item.userId === params.userId)
    if (params.sort === 'asc') {
      result.sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime())
    } else {
      result.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    }
    return result
  }

  getOrderById = async (params: { userId: string, orderId: string }): Promise<Order | undefined> => {
    return (await this.getOrder()).find((item) => item.userId === params.userId && item.orderId === params.orderId)
  }
}
