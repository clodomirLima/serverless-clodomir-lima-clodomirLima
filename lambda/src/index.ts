import { type APIGatewayProxyEvent, type Context, type APIGatewayProxyResult } from 'aws-lambda'
import { OrderRepository } from './Repository/OrderRepository'
import { AwsS3 } from './awsS3/awsS3'

const orderRepository = new OrderRepository(new AwsS3(
  process.env.BUCKET_ORDER ?? '',
  process.env.KEY ?? ''
))

export const handleRestAPI = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: '3f708f2e-bb07-4e05-8d3a-683639ea0674',
      description: 'O que tira o seu foco, não merece sua atenção.'
    })
  }
}

export const handleOrderListRestAPI = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const sort = event.queryStringParameters?.sort ?? 'desc'
  const userId = event.requestContext?.authorizer?.claims?.sub
  if (userId === undefined || userId === '') {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Unauthorized: User ID não encontrado no contexto.'
      })
    }
  }
  const result = await orderRepository.listOrders({
    userId,
    sort
  })
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}

export const handleOrderByIdRestAPI = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const orderId = event.pathParameters?.id ?? ''
  const userId = event.requestContext?.authorizer?.claims?.sub
  if (userId === undefined || userId === '') {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Unauthorized: User ID não encontrado no contexto.'
      })
    }
  }
  const result = await orderRepository.getOrderById({
    userId,
    orderId
  })

  if (result === undefined) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Nao foi encontrado order para o OrderId Informado.'
      })
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}
