import PrismaSingleton from "@lib/prismaSingleton";

export default abstract class Dao<ModelType, ModelClient extends {
    findFirstOrThrow(args: any): Promise<ModelType>;
    findMany(args?: any): Promise<ModelType[]>;
    create(args: any): Promise<ModelType>;
    update(args: any): Promise<ModelType>;
    updateMany(args: any): Promise<any>;
    delete(args: any): Promise<any>;
    deleteMany(args: any): Promise<any>;
    }>{
        
    protected model: ModelClient;

    public constructor(model: ModelClient) { this.model = model; }  

    public async getById(id: number | null): Promise<any | null>{
        try{
            if (id === null)
                throw Error("Id not provided");

            return await this.model.findFirstOrThrow({where: {ID: id}})
        }catch(err: any){
            return null;
        }
    }

    public async getAll(): Promise<ModelType[]>{
        try{
            return await this.model.findMany();
        }catch(err: any){
            return [];
        }
    }

    public async getSome(where: any, select: any | null = null): Promise<ModelType[]>{
        try{
            return await this.model.findMany({where: where, select: select});
        }catch(err: any){
            return [];
        }
    }

    public async getOne(where: any): Promise<ModelType | null>{
        try{
            return await this.model.findFirstOrThrow({where: where});
        }catch(err: any){
            return null;
        }
    }

    public async update(data: any, where: any): Promise<ModelType>{
        try{
            return await this.model.update({data: data, where: where});
        }catch(err: any){
            throw err;
        }
    }

    public async updateMany(data: any, where: any): Promise<ModelType>{
        try{
            return await this.model.updateMany({data: data, where: where});
        }catch(err: any){
            throw err;
        }
    }

    public async add(data: any): Promise<ModelType>{
        try{
            return await this.model.create({data: data});
        }catch(err: any){
            throw err;
        }
    }

    public async delete(id: number | null): Promise<any>{
        try{
            if (id === null)
                throw Error("Id not provided");

            await this.model.delete({ where: { ID: id }});
        }catch(err: any){
            console.error("FAILED TO DELETE WITH ID: " + id);
            throw err;
        }
    }

    public async deleteMany(where: any): Promise<any>{
        try{
            await this.model.deleteMany({ where: where});
        }catch(err: any){
            throw err;
        }
    }
}