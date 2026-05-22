import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenusService {
    create(createMenuDto: CreateMenuDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateMenuDto: UpdateMenuDto): string;
    remove(id: number): string;
}
