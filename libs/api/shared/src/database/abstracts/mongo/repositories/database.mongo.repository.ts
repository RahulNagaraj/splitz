import {
    Document,
    FilterQuery,
    Model,
    PipelineStage,
    PopulateOptions,
    Types,
    UpdateQuery,
    UpdateWithAggregationPipeline,
} from "mongoose";
import { DatabaseBaseRepositoryAbstract } from "../../database.base-repository.abstract";
import {
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseManyOptions,
    IDatabaseRawOptions,
    IDatabaseSaveOptions,
    IDatabaseSoftDeleteManyOptions,
} from "../../../interfaces/database.interface";
import { DATABASE_DELETED_AT_FIELD_NAME } from "../../../constants/database.constants";
import {
    PAGINATION_OFFSET,
    PAGINATION_PER_PAGE,
} from "../../../../pagination/constants/pagination.constants";
import { DatabaseMongoEntityAbstract } from "../entities/database.mongo.entity.abstract";

export abstract class DatabaseMongoRepositoryAbstract<
    Entity extends DatabaseMongoEntityAbstract,
    EntityDocument extends Entity & Document<Types.ObjectId>
> extends DatabaseBaseRepositoryAbstract<Entity, EntityDocument> {
    constructor(
        protected readonly repository: Model<Entity>,
        protected readonly joinOnFind?: PopulateOptions | PopulateOptions[]
    ) {
        super();
    }
    // Find
    async findAll<T = EntityDocument>(
        find: FilterQuery<Entity> = {},
        options?: IDatabaseFindAllOptions
    ): Promise<T[]> {
        const findAll = this.repository.find<T>(find);

        if (options?.withDeleted) {
            findAll.or([
                { [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false } },
                { [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true } },
            ]);
        } else {
            findAll.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.select) {
            findAll.select(options.select);
        }

        if (options?.paging) {
            findAll
                .limit(options.paging.limit ?? PAGINATION_PER_PAGE)
                .skip(options.paging.offset ?? PAGINATION_OFFSET);
        }

        if (options?.order) {
            findAll.sort(options.order);
        }

        if (options?.join) {
            const populate =
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[]);
            findAll.populate(populate);
        }

        return findAll.lean();
    }

    async findOne<T = EntityDocument>(
        find: FilterQuery<Entity>,
        options?: IDatabaseFindOneOptions
    ): Promise<T | null> {
        const findOne = this.repository.findOne<T>(find);

        if (options?.withDeleted) {
            findOne.or([
                {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
                },
                {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true },
                },
            ]);
        } else {
            findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.select) {
            findOne.select(options.select);
        }

        if (options?.join) {
            findOne.populate(
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[])
            );
        }

        if (options?.order) {
            findOne.sort(options.order);
        }

        return findOne.exec();
    }

    async findAllDistinct<T = EntityDocument>(
        field: string,
        find?: FilterQuery<T> | undefined,
        options?: IDatabaseFindAllOptions | undefined
    ): Promise<T[]> {
        const findAll = this.repository.distinct<T>(field, find);

        if (options?.withDeleted) {
            findAll.or([
                {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
                },
                {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true },
                },
            ]);
        } else {
            findAll.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.select) {
            findAll.select(options.select);
        }

        if (options?.paging) {
            findAll
                .limit(options.paging.limit ?? PAGINATION_PER_PAGE)
                .skip(options.paging.offset ?? PAGINATION_OFFSET);
        }

        if (options?.order) {
            findAll.sort(options.order);
        }

        if (options?.join) {
            const populate =
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[]);
            findAll.populate(populate);
        }

        return findAll.lean();
    }

    async findOneById<T = EntityDocument>(
        _id: string,
        options?: IDatabaseFindOneOptions | undefined
    ): Promise<T | null> {
        const findOne = this.repository.findById<T>(new Types.ObjectId(_id));

        if (options?.withDeleted) {
            findOne.or([
                {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
                },
                {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true },
                },
            ]);
        } else {
            findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.select) {
            findOne.select(options.select);
        }

        if (options?.join) {
            findOne.populate(
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[])
            );
        }

        if (options?.order) {
            findOne.sort(options.order);
        }

        return findOne.exec();
    }

    // Get total
    async getTotal<T = EntityDocument>(
        find?: FilterQuery<T>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number> {
        const count = this.repository.countDocuments(find);

        if (options?.withDeleted) {
            count.or([
                {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
                },
                {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true },
                },
            ]);
        } else {
            count.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.join) {
            count.populate(
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[])
            );
        }

        return count;
    }

    // Exist
    async exists<T = EntityDocument>(
        find: FilterQuery<T>,
        options?: IDatabaseExistOptions
    ): Promise<boolean> {
        if (options?.excludeId) {
            find = {
                ...find,
                _id: {
                    $nin: options?.excludeId.map((val) => new Types.ObjectId(val)) ?? [],
                },
            };
        }

        const exist = this.repository.exists(find);
        if (options?.withDeleted) {
            exist.or([
                {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
                },
                {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true },
                },
            ]);
        } else {
            exist.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false);
        }

        if (options?.join) {
            exist.populate(
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[])
            );
        }

        const result = await exist;
        return result ? true : false;
    }

    // Create
    async create<T = EntityDocument>(data: Entity, options?: IDatabaseCreateOptions): Promise<T> {
        const dataToCreate = data;
        if (options?._id) {
            dataToCreate._id = new Types.ObjectId(options?._id);
        }
        const created = await this.repository.create([data]);
        return created[0] as T;
    }

    // Delete
    async delete(document: EntityDocument, options?: IDatabaseSaveOptions): Promise<boolean> {
        try {
            await document.deleteOne(options);
            return true;
        } catch (error: unknown) {
            return false;
        }
    }

    async deleteManyByIds(_id: string[], options?: IDatabaseManyOptions): Promise<boolean> {
        const deleted = this.repository.deleteMany({
            _id: {
                $in: _id.map((val) => new Types.ObjectId(val)),
            },
        });

        if (options?.join) {
            deleted.populate(
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[])
            );
        }

        try {
            await deleted;
            return true;
        } catch (err: unknown) {
            return false;
        }
    }

    async deleteMany(find: FilterQuery<Entity>, options?: IDatabaseManyOptions): Promise<boolean> {
        const deleted = this.repository.deleteMany(find);

        if (options?.join) {
            deleted.populate(
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[])
            );
        }

        try {
            await deleted;
            return true;
        } catch (err: unknown) {
            return false;
        }
    }

    async softDelete(document: EntityDocument): Promise<boolean> {
        document.deletedAt = new Date();
        try {
            document.save();
            return true;
        } catch (error: unknown) {
            return false;
        }
    }

    async softDeleteManyByIds(
        _id: string[],
        options?: IDatabaseSoftDeleteManyOptions
    ): Promise<boolean> {
        const softDel = this.repository
            .updateMany(
                {
                    _id: {
                        $in: _id.map((val) => new Types.ObjectId(val)),
                    },
                },
                {
                    $set: {
                        deletedAt: new Date(),
                    },
                }
            )
            .where(DATABASE_DELETED_AT_FIELD_NAME)
            .exists(false);

        if (options?.join) {
            softDel.populate(
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[])
            );
        }

        try {
            await softDel;
            return true;
        } catch (err: unknown) {
            return false;
        }
    }

    async softDeleteMany(
        find: FilterQuery<Entity>,
        options?: IDatabaseSoftDeleteManyOptions
    ): Promise<boolean> {
        const softDel = this.repository
            .updateMany(find, {
                $set: {
                    deletedAt: new Date(),
                },
            })
            .where(DATABASE_DELETED_AT_FIELD_NAME)
            .exists(false);

        if (options?.join) {
            softDel.populate(
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[])
            );
        }

        try {
            await softDel;
            return true;
        } catch (err: unknown) {
            return false;
        }
    }

    // Update
    async updateMany(
        find: FilterQuery<Entity>,
        data: UpdateQuery<Entity>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        const update = this.repository
            .updateMany(find, {
                $set: data,
            })
            .where(DATABASE_DELETED_AT_FIELD_NAME)
            .exists(false);

        if (options?.join) {
            update.populate(
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[])
            );
        }

        try {
            await update;
            return true;
        } catch (err: unknown) {
            return false;
        }
    }

    async updateManyRaw(
        find: FilterQuery<Entity>,
        data: UpdateWithAggregationPipeline | UpdateQuery<Entity>,
        options?: IDatabaseManyOptions
    ): Promise<boolean> {
        const update = this.repository
            .updateMany(find, data)
            .where(DATABASE_DELETED_AT_FIELD_NAME)
            .exists(false);

        if (options?.join) {
            update.populate(
                typeof options.join === "boolean" && this.joinOnFind
                    ? this.joinOnFind
                    : (options.join as PopulateOptions | PopulateOptions[])
            );
        }

        try {
            await update;
            return true;
        } catch (err: unknown) {
            return false;
        }
    }

    // Raw
    async raw<RawResponse, RawQuery = PipelineStage[]>(
        rawOperation: RawQuery,
        options?: IDatabaseRawOptions
    ): Promise<RawResponse[]> {
        if (!Array.isArray(rawOperation)) {
            throw new Error("Operation must be array");
        }

        const pipeline: PipelineStage[] = rawOperation;

        if (options?.withDeleted) {
            pipeline.push({
                $match: {
                    $or: [
                        {
                            [DATABASE_DELETED_AT_FIELD_NAME]: {
                                $exists: false,
                            },
                        },
                        {
                            [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: true },
                        },
                    ],
                },
            });
        } else {
            pipeline.push({
                $match: {
                    [DATABASE_DELETED_AT_FIELD_NAME]: { $exists: false },
                },
            });
        }

        const aggregate = this.repository.aggregate<RawResponse>(pipeline);

        return aggregate;
    }
}
