import { NestFactory } from '@nestjs/core';
import {
  Module,
  Controller,
  Get,
  Post,
  Body,
  Injectable,
} from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import ngrok from 'ngrok';

@Injectable()
class AppService {
  private part1 = '';
  private part2 = '';

  constructor(private readonly http: HttpService) {}

  async sendMessage(msg: string, callbackUrl: string) {
    const payload = { msg, url: callbackUrl };
    const { data } = await firstValueFrom(
      this.http.post('https://test.icorp.uz/interview.php', payload),
    );

    this.part1 = data?.part1 || '';
    console.log('✅ First part received (part1):', this.part1);
    return this.part1;
  }

  savePart2(part2: string) {
    if (!part2) {
      console.error('❌ Part2 is empty or not provided');
      return;
    }
    this.part2 = part2;
    console.log('✅ Second part received (part2):', this.part2);
  }

  async getFinalMessage() {
    if (!this.part1 || !this.part2) {
      throw new Error('❌ Part1 or part2 is not available yet!');
    }

    const fullCode = `${this.part1}${this.part2}`;
    console.log('🔐 Combined code:', fullCode);

    const url = `https://test.icorp.uz/interview.php?code=${fullCode}`;
    const { data } = await firstValueFrom(this.http.get(url));

    console.log('🎉 Final message:', data);
    return { code: fullCode, message: data };
  }
}

@Controller()
class AppController {
  constructor(private readonly appService: AppService) {}

  private ngrokUrl = '';

  @Get('start')
  async start() {
    const callbackUrl = `https://yuette-seriocomic-monnie.ngrok-free.dev/callback`;
    console.log('🌐 Callback URL:', callbackUrl);

    const msg = 'Hello test API!';
    const part1 = await this.appService.sendMessage(msg, callbackUrl);
    return { message: 'First part received', part1, callbackUrl };
  }

  @Post('callback')
  async callback(@Body() body: any) {
    console.log('📩 Callback data:', body);
    const part2 = body?.part2;
    this.appService.savePart2(part2);
    return { status: 'ok', received: true };
  }

  @Get('final')
  async final() {
    return this.appService.getFinalMessage();
  }
}

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(require('body-parser').json());
  app.use(require('body-parser').urlencoded({ extended: true }));

  await app.listen(3000);
  console.log('🚀 Server started: http://localhost:3000');
  console.log('➡️ 1. GET /start → get first part and generate ngrok URL');
  console.log(
    '➡️ 2. POST /callback → second part will be received here (automatic)',
  );
  console.log('➡️ 3. GET /final → get final message');
}

bootstrap();
