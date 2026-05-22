import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async create(createPageDto: CreatePageDto) {
    return this.prisma.page.create({
      data: createPageDto,
    });
  }

  async findAll() {
    return this.prisma.page.findMany();
  }

  async findOne(id: number) {
    return this.prisma.page.findUnique({
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.page.delete({
      where: { id },
    });
  }
}