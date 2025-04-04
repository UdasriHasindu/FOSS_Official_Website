import { Content } from "@/data/ArticleProps";
import classes from "./styles.module.css";

export function OrderList({ data, type }: Readonly<Content>) {
  return (
    <ol start={1} className={classes.order_list}>
      {Array.isArray(data) ? (
        data.map((d, i) => <li key={i}>{d}</li>)
      ) : (
        <p>Data Not found</p>
      )}
    </ol>
  );
}
