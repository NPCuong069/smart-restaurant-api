import { Controller, Get, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenuItems() {
    return this.menuService.getAllMenuItems();
  }

  @Get('search')
  async searchMenuItems(@Query('query') query: string) {
    return this.menuService.searchMenuItemsByText(query);
  }
}
