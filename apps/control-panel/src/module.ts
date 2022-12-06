import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BoatModule } from '@libs/boat';
import { AuthLibModule } from 'libs/auth/src';
import { UsersLibModule } from 'libs/users/src';
import { MailService } from './jobs/mail';
import { ControlPanelAPIService } from './services';
import { ControlPanelResolver } from './resolvers';
import { JwtGuard } from './guards';
import { CommonModule } from '@libs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    BoatModule,
    AuthLibModule,
    UsersLibModule,
    CommonModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('auth'),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      include: [AppModule],
      context: ({ req }) => ({ req }),
      playground: true,
    }),
  ],
  providers: [
    MailService,
    ControlPanelAPIService,
    ControlPanelResolver,
    JwtGuard,
  ],
})
export class AppModule {}
