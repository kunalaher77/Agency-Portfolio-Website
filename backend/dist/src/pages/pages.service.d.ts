import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
export declare class PagesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPageDto: CreatePageDto): Promise<{
        title: string;
        slug: string;
        content: string | null;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findAll(): Promise<{
        title: string;
        slug: string;
        content: string | null;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    findOne(id: number): Promise<{
        title: string;
        slug: string;
        content: string | null;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    } | null>;
    remove(id: number): Promise<{
        title: string;
        slug: string;
        content: string | null;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
