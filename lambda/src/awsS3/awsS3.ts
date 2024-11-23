import { type Db, type Order } from '../Repository/types/IOrderRepository'
import { S3Client, GetObjectCommand, type GetObjectCommandOutput } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: 'us-east-1'
})

export class AwsS3 implements Db {
  private readonly bucket: string
  private readonly key: string
  constructor (bucket: string, key: string) {
    this.bucket = bucket
    this.key = key
  }

  Orders = async (): Promise<Order[]> => {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: this.key
    })

    const response: GetObjectCommandOutput = await s3.send(command)
    const bodyContent = await response.Body?.transformToString() ?? '[]'
    return JSON.parse(bodyContent)
  }
}
