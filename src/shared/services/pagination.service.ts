import { Injectable } from '@nestjs/common';
import { Model, FilterQuery } from 'mongoose';
import { PaginationOptions } from '../interfaces/pagination-options.interface';

@Injectable()
export class PaginationService<T> {
  async paginate(
    model: Model<T>,
    filterQuery: FilterQuery<T>,
    paginationQuery: PaginationOptions<T>,
  ) {
    let { limit, page, sort, populate, projection, kljucneReci, populate2 } = paginationQuery;

    const skip = (page - 1) * limit;

    if (kljucneReci) {
      filterQuery = {
        ...filterQuery,
        naziv: { $regex: kljucneReci, $options: 'i' },
      };
    }


    const [totalItems, items] = await Promise.all([
      model.countDocuments(filterQuery),
      model
        .find(filterQuery, projection)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate(populate)
        .populate(populate2)
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items,
    };
  }
}