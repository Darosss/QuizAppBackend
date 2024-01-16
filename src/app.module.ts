import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizCategoriesModule } from './quiz-categories';
import { QuizAnswersModule } from './quiz-answers';
import { QuizQuestionsModule } from './quiz-questions';
import { RouterModule } from '@nestjs/core';
import { routes } from './routes';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuizSubmissionsModule } from './quiz-submissions/quiz-submissions.module';

@Module({
  imports: [
    RouterModule.register(routes),
    ConfigModule.forRoot(),
    QuizAnswersModule,
    QuizCategoriesModule,
    QuizAnswersModule,
    QuizQuestionsModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_DB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    QuizSubmissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
