import { QueueDriver, InternalMessage } from '@squareboat/nest-queue-strategy';
import AWS = require('aws-sdk');
import { DriverJob } from '@squareboat/nest-queue-strategy';

export class SqsJob extends DriverJob {
  public getMessage(): string {
    return this.data.Body;
  }
}

export class SqsQueueDriver implements QueueDriver {
  private client: AWS.SQS;
  private queueUrl: string;

  constructor(private options: Record<string, any>) {
    const awsOptions = { region: options.region } as Record<string, any>;

    if (options.profile) {
      options['credentials'] = new AWS.SharedIniFileCredentials({
        profile: options.profile,
      });
    }

    this.client = new AWS.SQS({ ...awsOptions });
    this.queueUrl = options.prefix + '/' + options.queue;
  }

  async push(message: string, rawPayload: InternalMessage): Promise<void> {
    const params = {
      DelaySeconds: rawPayload.delay,
      MessageBody: message,
      QueueUrl: this.options.prefix + '/' + rawPayload.queue,
    };

    await this.client.sendMessage(params).promise().then();
    return;
  }

  async pull(options: Record<string, any>): Promise<SqsJob | null> {
    const params = {
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ['All'],
      QueueUrl: this.options.prefix + '/' + options.queue,
      VisibilityTimeout: 30,
      WaitTimeSeconds: 20,
    };

    const response = await this.client.receiveMessage(params).promise();
    const message = response.Messages ? response.Messages[0] : null;
    return message ? new SqsJob(message) : null;
  }

  async remove(job: SqsJob, options: Record<string, any>): Promise<void> {
    const params = {
      QueueUrl: this.options.prefix + '/' + options.queue,
      ReceiptHandle: job.data.ReceiptHandle,
    };

    await this.client.deleteMessage(params).promise();

    return;
  }

  async purge(options: Record<string, any>): Promise<void> {
    const params = {
      QueueUrl: this.options.prefix + '/' + options.queue,
    };

    await this.client.purgeQueue(params).promise();

    return;
  }

  async count(options: Record<string, any>): Promise<number> {
    const params = {
      QueueUrl: this.options.prefix + '/' + options.queue,
      AttributeNames: ['ApproximateNumberOfMessages'],
    };
    const response: Record<string, any> = await this.client
      .getQueueAttributes(params)
      .promise();
    return +response.Attributes.ApproximateNumberOfMessages;
  }
}
