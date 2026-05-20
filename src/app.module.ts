import { Module } from '@nestjs/common';
import { PagesModule } from './pages/pages.module';
import { PrismaModule } from './prisma/prisma.module';
import { MenusModule } from './menus/menus.module';

@Module({
  imports: [PrismaModule, PagesModule, MenusModule],
})
export class AppModule {}