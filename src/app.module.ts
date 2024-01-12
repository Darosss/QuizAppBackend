import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizCategoriesModule } from './quiz-categories';
import { QuizAnswersModule } from './quiz-answers';
import { QuizQuestionsModule } from './quiz-questions/quiz-questions.module';
import { RouterModule } from '@nestjs/core';
import { routes } from './routes';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
