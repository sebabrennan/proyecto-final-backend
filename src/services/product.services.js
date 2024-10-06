import Services from "./class.services.js";
import ProductDaoMongo from "../daos/product.dao.js";
import { generateProducts } from "../utils/products.utils.js";
import { sendMail } from "./mailing.service.js";
import UserService from './user.services.js';

const prodDao = new ProductDaoMongo();
const userDao = new UserService();


export default class ProductService extends Services {
    constructor(){
        super(prodDao);
    }

    createProductsMockService = async (cant = 100) => {
        try {
            const productsArray= [];
            for (let i = 0; i < cant; i++) {
                const product = generateProducts();
                productsArray.push(product)
            }
            return await prodDao.create(productsArray)
        } catch (error) {
            throw new Error(error);
        }
    }

    deleteProductById = async (productId, user) => {
        const product = await prodDao.getById(productId);
        if(!product) return "ID inexistente";
        if (user.role === "admin" || product.owner === user.email){
            const deleteProduct = await prodDao.delete(productId);
            if(deleteProduct.owner !== "admin"){
                const userOwner = await userDao.getUserByEmail(deleteProduct.owner)
                if(userOwner.role === "premium") await sendMail(userOwner, "deleteProduct")
            }
            return deleteProduct;
        } else {
            return "No tienes permisos para realizar esta acción"
        }
    }

};