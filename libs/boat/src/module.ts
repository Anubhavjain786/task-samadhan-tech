import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import { BaseValidator, IsValueFromConfigConstraint } from './validator';
import { EventExplorer } from './events';
import { EventQueueWorker } from './events/queue';
import {
  QueueConsoleCommands,
  QueueExplorer,
  QueueMetadata,
  QueueService,
} from './queue';
import { AppConfig } from './utils';
import { ConsoleExplorer, ListCommands } from './console';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import config from 'config';

@Global()
@Module({
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: config,
    }),
  ],
  providers: [
    AppConfig,
    BaseValidator,
    ConsoleExplorer,
    EventExplorer,
    EventQueueWorker,
    IsValueFromConfigConstraint,
    ListCommands,
    QueueExplorer,
    QueueService,
    QueueMetadata,
    QueueConsoleCommands,
  ],
  exports: [BaseValidator],
})
export class BoatModule {}
