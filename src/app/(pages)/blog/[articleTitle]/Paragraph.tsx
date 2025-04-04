import { Content } from "@/data/ArticleProps";
import classes from "./styles.module.css";

export function Paragrph({ data, type }: Content) {
  return <p className={classes.para}>{data}</p>;
}
