/* eslint-disable @next/next/no-img-element */
import EditIcon from "icons/edit";
import ViewIcon from "icons/view";
import DeleteIcon from "icons/delete";
import css from "styles/order.module.scss";
import SyncIcon from "icons/sync";

interface TableListProps {
  count: number;
  name: string;
  date: string;
  image: string;
  price?: string;
  status?: string;
  categories: string[];
  // Methods
  onDelete?: () => void;
  onView?: () => void;
  onEdit?: (value: any) => any;
  onSync?: () => void;
}
const ProductList = ({
  count,
  name,
  date,
  image,
  categories,
  onView,
  onEdit,
  onDelete,
  onSync,
}: TableListProps) => {
  return (
    <tr>
      <td>
        <div className={css.checkbox}>
          <input type="checkbox" />
        </div>
      </td>
      <td>
        <div className={css.checkbox}>{count}</div>
      </td>
      <td>
        <div className={css.image}>
          <img src={image || "/image.png"} alt="Product Image" />
        </div>
      </td>
      <td>
        <div className={css.productrname}>
          <p>{name}</p>
        </div>
      </td>
      <td>
        <div className={css.price}>
          {categories?.map((item) => {
            return <div key={item}>{item}</div>;
          })}
        </div>
      </td>
      <td>
        <div className={`${css.status} ${css.approved}`}>Approved</div>
      </td>
      <td>
        <div className={css.date}>
          {date
            ? new Intl.DateTimeFormat("en-GB", {
                dateStyle: "long",
                timeStyle: "short",
              }).format(new Date(date))
            : "-"}
        </div>
      </td>
      <td>
        <div className={css.actionbtn}>
          <ul className={css.actionbtnul}>
            <li onClick={onView} title="View">
              <ViewIcon height={16} width={16} />
            </li>
            <li onClick={onEdit} title="Edit">
              <EditIcon height={16} width={16} />
            </li>
            <li onClick={onSync} title="Sync with Google Merchant">
              <SyncIcon height={16} width={16} />
            </li>
            <li onClick={onDelete} title="Delete">
              <DeleteIcon height={16} width={16} />
            </li>
          </ul>
        </div>
      </td>
    </tr>
  );
};

export default ProductList;
