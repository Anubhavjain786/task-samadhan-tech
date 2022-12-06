import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { BoatConstants, GenericFunction } from '../constants';
import { QueueMetadata } from './metadata';

@Injectable()
export class QueueExplorer implements OnModuleInit {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onModuleInit() {
    const wrappers = this.discovery.getProviders();
    wrappers.forEach((w) => {
      const { instance } = w;
      if (
        !instance ||
        typeof instance === 'string' ||
        !Object.getPrototypeOf(instance)
      ) {
        return;
      }
      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (key: string) => this.lookupJobs(instance, key),
      );
    });
  }

  lookupJobs(instance: Record<string, GenericFunction>, key: string) {
    const methodRef = instance[key];
    const hasJobMeta = Reflect.hasMetadata(
      BoatConstants.queueJobName,
      instance,
      key,
    );
    if (!hasJobMeta) return;
    const jobName = Reflect.getMetadata(
      BoatConstants.queueJobName,
      instance,
      key,
    );
    QueueMetadata.addJob(jobName, {
      options: Reflect.getMetadata(BoatConstants.queueOptions, instance, key),
      target: methodRef.bind(instance),
    });
  }
}
