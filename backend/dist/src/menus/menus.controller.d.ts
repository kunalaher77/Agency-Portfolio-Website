import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenusController {
    private readonly menusService;
    constructor(menusService: MenusService);
    create(createMenuDto: CreateMenuDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMenuDto: UpdateMenuDto): string;
    remove(id: string): string;
}
