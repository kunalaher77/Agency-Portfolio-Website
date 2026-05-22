import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
export declare class PagesController {
    private readonly pagesService;
    constructor(pagesService: PagesService);
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
    findOne(id: string): Promise<{
        title: string;
        slug: string;
        content: string | null;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    } | null>;
    remove(id: string): Promise<{
        title: string;
        slug: string;
        content: string | null;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
