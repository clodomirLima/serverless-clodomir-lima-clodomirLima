import { OrderRepository } from '../src/Repository/OrderRepository'
import { Db } from '../src/Repository/types/IOrderRepository'
const orderJson = require("../../data/orders.json")

describe('handleRestAPI', () => {
  const dBMock: Db = {
    Orders: jest.fn().mockImplementation(() => Promise.resolve(orderJson))
  }

  const orderRepository = new OrderRepository(dBMock)

  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => { })
    jest.spyOn(console, 'info').mockImplementation(() => { })
    jest.spyOn(console, 'error').mockImplementation(() => { })
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return listOrders Asc', async () => {
    const result = await orderRepository.listOrders(
      {
        userId: "cliente2",
        sort: "asc"
      }
    )
    expect(result).toBeDefined()
    expect(result.length).toEqual(32)
    expect(new Date(result[0].orderDate).getTime()).toBeLessThan(new Date(result[1].orderDate).getTime());
  })

  it('should return listOrders desc', async () => {
    const result = await orderRepository.listOrders(
      {
        userId: "cliente2",
        sort: "desc"
      }
    )
    expect(result).toBeDefined()
    expect(result.length).toEqual(32)
    expect(new Date(result[1].orderDate).getTime()).toBeLessThan(new Date(result[0].orderDate).getTime());
  })

  it('should return getOrderById', async () => {
    const resultMock = {
      "orderId": "72ab33eb-42a7-4e8c-8f15-d1fe232c79fd",
      "userId": "cliente2",
      "orderDate": "2024-09-14T16:41:02.779Z",
      "status": "readyToShip",
      "items": [
        {
          "productId": "98b4g619-33bc-4579-a855-08a9e2d33469",
          "quantity": 3,
          "totalAmount": 4499.97
        },
        {
          "productId": "ad97f35f-a44c-4569-a84b-08a9e2d33469",
          "quantity": 5,
          "totalAmount": 125
        },
        {
          "productId": "a840dc95-9b49-476e-b844-90cdfc38fd48",
          "quantity": 1,
          "totalAmount": 235.5
        }
      ],
      "totalAmount": 4860.47
    };
    const result = await orderRepository.getOrderById(
      {
        userId: "cliente2",
        orderId: "72ab33eb-42a7-4e8c-8f15-d1fe232c79fd"
      }
    )
    expect(result).toBeDefined()
    expect(result).toEqual(resultMock)
  })
})