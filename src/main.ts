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
import * as ngrok from 'ngrok';

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
    console.log('✅ Birinchi qism (part1):', this.part1);
    return this.part1;
  }

  savePart2(part2: string) {
    if (!part2) {
      console.error('❌ part2 qiymati bo‘sh yoki aniqlanmadi');
      return;
    }
    this.part2 = part2;
    console.log('✅ Ikkinchi qism (part2) qabul qilindi:', this.part2);
  }

  async getFinalMessage() {
    if (!this.part1 || !this.part2) {
      throw new Error('❌ part1 yoki part2 hali mavjud emas!');
    }

    const fullCode = `${this.part1}${this.part2}`;
    console.log('🔐 Birlashtirilgan kod:', fullCode);

    const url = `https://test.icorp.uz/interview.php?code=${fullCode}`;
    const { data } = await firstValueFrom(this.http.get(url));

    console.log('🎉 Yakuniy xabar:', data);
    return { code: fullCode, message: data };
  }
}

@Controller()
class AppController {
  constructor(private readonly appService: AppService) {}

  private ngrokUrl = '';

  @Get('start')
  async start() {
    this.ngrokUrl = await ngrok.connect(3000);
    const callbackUrl = `${this.ngrokUrl}/callback`;
    console.log('🌐 Callback URL:', callbackUrl);

    const msg = 'Salom test API!';
    const part1 = await this.appService.sendMessage(msg, callbackUrl);
    return { message: 'Birinchi qism olindi', part1, callbackUrl };
  }

  @Post('callback')
  async callback(@Body() body: any) {
    console.log('📩 Callback ma’lumot:', body);
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
  console.log('🚀 Server ishga tushdi: http://localhost:3000');
  console.log('➡️ 1. GET /start → birinchi qismni olish va ngrok URL yaratish');
  console.log(
    '➡️ 2. POST /callback → ikkinchi qism shu yerga keladi (avtomatik)',
  );
  console.log('➡️ 3. GET /final → yakuniy xabarni olish');
}
bootstrap();
