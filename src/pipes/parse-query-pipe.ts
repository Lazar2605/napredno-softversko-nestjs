import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  transform(value: any) {
    let { sort, projection, limit, page } = value;
    [sort, projection, limit, page] = [
      this.parseSort(sort),
      this.parseProjection(projection),
      this.parseLimit(limit),
      this.parsePage(page),
    ];

    return { ...value, sort, projection, limit, page };
  }

  private parseSort(sort: any) {
    if (sort) {
      try {
        return JSON.parse(sort);
      } catch (error) {
        return {"cena.iznos":1};
      }
    }
    return {"cena.iznos":1};
  }

  private parseProjection(projeciton: any) {
    if (projeciton) {
      try {
        return JSON.parse(projeciton);
      } catch (error) {
        return undefined;
      }
    }
    return undefined;
  }

  private parseLimit(limit: any) {
    if (limit) {
      try {
        const parsedLimit = JSON.parse(limit);
        if (+parsedLimit) {
          return Math.min(Math.max(parsedLimit, 1), 50);
        }
        return 10;
      } catch (error) {
        return 10;
      }
    }
    return 10;
  }

  private parsePage(page: any) {
    if (page) {
      try {
        const parsedPage = JSON.parse(page);
        if (+parsedPage) {
          return Math.max(parsedPage, 1);
        }
        return 1;
      } catch (error) {
        return 1;
      }
    }
    return 1;
  }
}