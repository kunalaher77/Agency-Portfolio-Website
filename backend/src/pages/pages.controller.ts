import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  findAll() {
    return this.pagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagesService.remove(Number(id));
  }
}