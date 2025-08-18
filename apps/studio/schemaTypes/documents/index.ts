import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { navbar } from "./navbar";
import { page } from "./page";
import { settings } from "./settings";
import { category } from "./category";
import { pokemon } from "./pokemon";

export const singletons = [homePage, blogIndex, settings, footer, navbar];
//what:added category to documents
//why: to export category schema type into sanity studio and across the application
//third task : add pokemon schema type to documents
export const documents = [blog, page, category, faq, author, pokemon, ...singletons];
